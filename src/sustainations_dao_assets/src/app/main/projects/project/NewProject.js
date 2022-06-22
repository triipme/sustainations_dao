import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector, useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getLocations } from '../../../../api/location';
import ProjectOverview from './steps/ProjectOverview';
import ProjectDetails from './steps/ProjectDetails';
import ProjectAdditionalInfo from './steps/ProjectAdditionalInfo';
import ProjectSubmit from './steps/ProjectSubmit';
import { setS3Object } from "../../../hooks";
import moment from 'moment';
import MobileDetect from 'mobile-detect';

const steps = ['Project overview', 'Project details', 'Additional info', 'Submit'];

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a product name'),
});

function NewProduct() {
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = md.mobile();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [locations, setLocations] = useState([]);
  const [staticAttrs, setStaticAttrs] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useTheme();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      story: '',
      location: '',
      categories: [],
      document: '',
      fundingType: '',
      fundingAmount: 0,
      discussionLink: '',
      images: [],
      video: '',
      termsConditions: false,
      dueDate: moment(),
    },
    resolver: yupResolver(schema),
  });
  const { getValues } = methods;

  useEffect(() => {
    (async () => {
      try {
        setLocations(await getLocations());
        setStaticAttrs(await user.actor.proposalStaticAttributes());
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = getValues();
    const { images, document } = data;
    const payload = {
      name: data.name,
      description: [data.description],
      story: [data.story],
      location: data.location,
      categories: data.categories,
      document: [data.document?.path || ''],
      fundingType: data.fundingType,
      fundingAmount: parseFloat(data.fundingAmount) * 1e8,
      discussionLink: [data.discussionLink],
      images: [data.images.map(image => image.path)],
      video: [data.video],
      dueDate: moment(data.dueDate).unix() * 1e9,
    }

    try {
      const result = await user.actor.submitProposal(payload);
      if ("ok" in result) {
        const uploadFiles = images.map(image => {
          return {
            file: image.base64data,
            name: image.path
          };
        });
        if (!_.isEmpty(document)) {
          uploadFiles.push({
            file: document.base64data,
            name: document.path
          });
        }
        const data = await setS3Object(uploadFiles);
        Promise.all(data).then(() => {
          dispatch(showMessage({ message: 'Success!' }));
          navigate(`/projects/${result.ok}`);
        });
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "BalanceLow": "You need minimum 0.0004 ICP to submit project.",
        "TransferFailure": "Can not transfer ICP."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  if (_.isEmpty(locations) || _.isEmpty(staticAttrs)) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col items-center p-24 sm:p-40">
      <div className="flex flex-col w-full max-w-7xl">
        <div className="flex items-center">
          <Button
            to="/projects"
            component={Link}
            className="mb-8"
            color="secondary"
            variant="text"
            startIcon={
              <FuseSvgIcon size={20}>
                {theme.direction === 'ltr'
                  ? 'arrow_back'
                  : 'arrow_forward'}
              </FuseSvgIcon>
            }
          >
            Back to list
          </Button>
        </div>
        <Card className="w-full py-32 mx-auto rounded-2xl shadow">
          <CardContent>
            <FormProvider {...methods}>
              <Stepper activeStep={activeStep} alternativeLabel={isMobile}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div className="flex items-center mt-32">
                <div className="flex-auto mt-px border-t"></div>
              </div>
              <div className={activeStep !== 0 ? 'hidden' : ''}>
                <ProjectOverview />
              </div>
              <div className={activeStep !== 1 ? 'hidden' : ''}>
                <ProjectDetails locations={locations} fundingTypes={staticAttrs.fundingTypes} />
              </div>
              <div className={activeStep !== 2 ? 'hidden' : ''}>
                <ProjectAdditionalInfo categories={staticAttrs.categories} />
              </div>
              <div className={activeStep !== 3 ? 'hidden' : ''}>
                <ProjectSubmit />
              </div>
              <React.Fragment>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    variant="contained"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {activeStep === steps.length - 1 ?
                    (<LoadingButton variant="contained" color="primary" loading={loading} onClick={handleSubmit}>Submit project</LoadingButton>)
                    : (<Button variant="contained" color="primary" onClick={handleNext}>Next</Button>)
                  }
                </Box>
              </React.Fragment>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProduct;
