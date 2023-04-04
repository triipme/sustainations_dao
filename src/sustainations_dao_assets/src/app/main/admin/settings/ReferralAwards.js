import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useFormContext } from 'react-hook-form';

function ReferralAwards(props) {
  const { usableItems, materials } = props
  const methods = useFormContext();
  const { control, formState, watch, setValue } = methods;
  const { errors } = formState;
  console.log("methods ",methods)

  const referralAwards = watch('referralAwards');
  console.log(referralAwards)
  const onRemoveReferralAward = (uuid) => {
    const list = referralAwards.map(item => {
      if (item.uuid == uuid) {
        return _.merge(item, { deleted: true });
      } else {
        return item;
      }
    });
    if (_.findIndex(list, { deleted: false }) == -1) {
      return;
    }
    setValue('referralAwards', list);
  }

  const handleChangeType = (event, uuid) => {
    const list = referralAwards.map(item => {
      if (item.uuid == uuid) {
        return {
          uuid,
          refType: event.target.value,
          refId: null,
          amount: null,
          deleted: false
        };
      } else {
        return item;
      }
    });
    setValue('referralAwards', list);
  };

  const handleChangeId = (event, uuid) => {
    const list = referralAwards.map(item => {
      if (item.uuid == uuid) {
        return {
          uuid,
          refType: item.refType,
          refId: event.target.value,
          amount: item.amount,
          deleted: false
        };
      } else {
        return item;
      }
    });
    setValue('referralAwards', list);
  };

  const addAward = () => {
    const item = {
      uuid: uuidv4(),
      refType: 'icp',
      refId: 'icp',
      amount: null,
      deleted: false
    };
    setValue('referralAwards', _.concat(referralAwards, item));
  };

  return (
    <div>
      {referralAwards.map((item, itemIndex) => (
        <div className={`flex -mx-4 ${item.deleted && 'hidden'}`}>
          <Controller
            name={`referralAwards[${itemIndex}][refType]`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl required sx={{ m: 1, minWidth: 120 }} className="mt-8 mb-16 mx-4 min-w-256">
                <InputLabel id={`referralAwards_${itemIndex}_refType_label`}>Award Type</InputLabel>
                <Select
                  value={value}
                  error={!!errors.referralAwards?.[itemIndex]?.refType}
                  required
                  labelId={`referralAwards_${itemIndex}_refType_label`}
                  id={`referralAwards_${itemIndex}_refType`}
                  label="Select award type *"
                  variant="outlined"
                  onChange={(event) => {
                    onChange(event.target.value);
                    handleChangeType(event, item.uuid);
                  }}
                >
                  <MenuItem key="icp" value="icp">ICP</MenuItem>
                  <MenuItem key="usableItem" value="usableItem">Usable Item</MenuItem>
                  <MenuItem key="material" value="material">Material (Seed)</MenuItem>
                </Select>
                {errors?.referralAwards?.[itemIndex]?.refId?.message && (<FormHelperText error>{errors?.referralAwards?.[itemIndex]?.refType?.message}</FormHelperText>)}
              </FormControl>
            )}
          />
          {item.refType == 'icp' && (
            <Controller
              name={`referralAwards[${itemIndex}][refId]`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl required sx={{ m: 1, minWidth: 120 }} className="mt-8 mb-16 mx-4 min-w-256">
                  <InputLabel id={`referralAwards_${itemIndex}_refId_label`}>Select Award</InputLabel>
                  <Select
                    error={!!errors.referralAwards?.[itemIndex]?.refId}
                    required
                    labelId={`referralAwards_${itemIndex}_refId_label`}
                    id={`referralAwards_${itemIndex}_refId`}
                    label="Select award *"
                    variant="outlined"
                    value={value}
                    onChange={(event) => {
                      onChange(event.target.value);
                      handleChangeId(event, item.uuid);
                    }}
                  >
                    <MenuItem key="icp" value="icp">ICP</MenuItem>
                  </Select>
                  {errors?.referralAwards?.[itemIndex]?.refId?.message && (<FormHelperText error>{errors?.referralAwards?.[itemIndex]?.refId?.message}</FormHelperText>)}
                </FormControl>
              )}
            />
          )}
          {item.refType == 'usableItem' && (
            <Controller
              name={`referralAwards[${itemIndex}][refId]`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl required sx={{ m: 1, minWidth: 120 }} className="mt-8 mb-16 mx-4 min-w-256">
                  <InputLabel id={`referralAwards_${itemIndex}_refId_label`}>Select Award</InputLabel>
                  <Select
                    error={!!errors.referralAwards?.[itemIndex]?.refId}
                    required
                    labelId={`referralAwards_${itemIndex}_refId_label`}
                    id={`referralAwards_${itemIndex}_refId`}
                    label="Select award *"
                    variant="outlined"
                    value={value}
                    onChange={(event) => {
                      onChange(event.target.value);
                      handleChangeId(event, item.uuid);
                    }}
                  >
                    {usableItems?.map((uItem, uIndex) => (
                      <MenuItem key={uIndex} value={uItem.id}>{uItem.name}</MenuItem>
                    ))}
                  </Select>
                  {errors?.referralAwards?.[itemIndex]?.refId?.message && (<FormHelperText error>{errors?.referralAwards?.[itemIndex]?.refId?.message}</FormHelperText>)}
                </FormControl>
              )}
            />
          )}
          {item.refType == 'material' && (
            <Controller
              name={`referralAwards[${itemIndex}][refId]`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl required sx={{ m: 1, minWidth: 120 }} className="mt-8 mb-16 mx-4 min-w-256">
                  <InputLabel id={`referralAwards_${itemIndex}_refId_label`}>Select Award</InputLabel>
                  <Select
                    error={!!errors.referralAwards?.[itemIndex]?.refId}
                    required
                    labelId={`referralAwards_${itemIndex}_refId_label`}
                    id={`referralAwards_${itemIndex}_refId`}
                    label="Select award *"
                    variant="outlined"
                    value={value}
                    onChange={(event) => {
                      onChange(event.target.value);
                      handleChangeId(event, item.uuid);
                    }}
                  >
                    {materials?.map((mItem, mIndex) => (
                      <MenuItem key={mIndex} value={mItem.id}>{mItem.name}</MenuItem>
                    ))}
                  </Select>
                  {errors?.referralAwards?.[itemIndex]?.refId?.message && (<FormHelperText error>{errors?.referralAwards?.[itemIndex]?.refId?.message}</FormHelperText>)}
                </FormControl>
              )}
            />
          )}
          <Controller
            name={`referralAwards[${itemIndex}][amount]`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.referralAwards?.[itemIndex]?.amount}
                required
                helperText={errors?.referralAwards?.[itemIndex]?.amount?.message}
                className="mt-8 mb-16 mx-4"
                label="Amount"
                type="number"
                variant="outlined"
                size="medium"
                fullWidth
              />
            )}
          />
          <Button
            className="px-16"
            color="warning"
            variant="contained"
            startIcon={
              <FuseSvgIcon className="" size={20}>
                remove
              </FuseSvgIcon>
            }
            onClick={() => { onRemoveReferralAward(item.uuid) }}
          >
          </Button>
        </div>
      ))}
      <Button
        className="px-16 min-w-128"
        color="secondary"
        variant="contained"
        startIcon={
          <FuseSvgIcon className="" size={20}>
            add
          </FuseSvgIcon>
        }
        onClick={() => { addAward() }}
      >
        Add Award
      </Button>
    </div>
  );
}

export default ReferralAwards;
