import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
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

const SceneImages = ({control, imageType, image}) => {
  console.log("IMAGEEEEE",image)

  return (
    <Root>
      <div style={{textAlign: "center"}} className="text-lg font-bold mt-16 mb-16">{imageType}</div>
      <div className="flex-1">
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
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
                          base64data: `data:${file.type};base64,${btoa(reader.result)}`,
                          file: file
                        });
                      };
                      reader.onerror = reject;
                      reader.readAsBinaryString(file);
                    });
                  }
                  const newImage = await readFileAsync();
                  onChange(newImage);
                }}
              />
              <FuseSvgIcon size={32} color="action">
                cloud_upload
              </FuseSvgIcon>
              <img className="max-w-none w-auto h-full" src={image.base64data} />
            </Box>
          )}
        />
      </div>
    </Root>
  );
}

export default SceneImages;
