import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';

const Root = styled('div')(({ theme }) => ({
  '& .productImageFeaturedStar': {
    position: 'absolute',
    top: 0,
    right: 0,
    color: orange[400],
    opacity: 0,
  },

  '& .productImageUpload': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  '& .productImageItem': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& .productImageFeaturedStar': {
        opacity: 0.8,
      },
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& .productImageFeaturedStar': {
        opacity: 1,
      },
      '&:hover .productImageFeaturedStar': {
        opacity: 1,
      },
    },
  },
}));

function ProductImagesTab() {
  const methods = useFormContext();
  const { control, watch, setValue } = methods;

  const images = watch('images');
  const onRemoveImage = (imageId) => {
    _.remove(images, item => item.id == imageId);
    setValue('images', images);
  }

  return (
    <Root>
      <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
        <Controller
          name="images"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              component="label"
              htmlFor="button-file"
              className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
            >
              <input
                accept="image/*"
                className="hidden"
                id="button-file"
                type="file"
                onChange={async (e) => {
                  function readFileAsync() {
                    return new Promise((resolve, reject) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      const reader = new FileReader();
                      const uuid = uuidv4();
                      reader.onload = () => {
                        resolve({
                          id: uuid,
                          file: `data:${file.type};base64,${btoa(reader.result)}`,
                          name: `${process.env.NODE_ENV}/refill-products/${uuid}.${file.type.split("/")[1]}`
                        });
                      };
                      reader.onerror = reject;
                      reader.readAsBinaryString(file);
                    });
                  }
                  const newImage = await readFileAsync();
                  onChange([newImage, ...value]);
                }}
              />
              <FuseSvgIcon size={32} color="action">
                cloud_upload
              </FuseSvgIcon>
            </Box>
          )}
        />
        {images?.map((image) => (
          <div
            tabIndex={0}
            className="productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg"
            key={image.id}
          >
            <FuseSvgIcon
              role="button" className="productImageFeaturedStar"
              onClick={() => onRemoveImage(image.id)}
            >clear_outlined</FuseSvgIcon>
            <img className="max-w-none w-auto h-full" src={image.file} alt="product" />
          </div>
        ))}
      </div>
    </Root>
  );
}

export default ProductImagesTab;
