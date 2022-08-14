import {
  Button,
  Input,
  Paper,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function ProductsHeader(props) {
  const {
    handleSearchText, searchPlaceholder, title,
    addLink, addLinkText, categories, titleClass,
    selectedCategory, handleSelectedCategory
  } = props;

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className={`${titleClass || 'text-24 md:text-32'} font-extrabold tracking-tight`}
      >
        {title}
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
        <FormControl className="flex w-full sm:w-136" variant="outlined">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            label="Category"
            value={selectedCategory}
            onChange={handleSelectedCategory}
          >
            <MenuItem value="all">
              <em> All </em>
            </MenuItem>
            {categories?.map((category) => (
              <MenuItem value={category} key={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Paper
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
        >
          <FuseSvgIcon color="disabled">search_outlined</FuseSvgIcon>

          <Input
            placeholder={searchPlaceholder}
            className="flex flex-1"
            disableUnderline
            fullWidth
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={handleSearchText}
          />
        </Paper>
        {addLink && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <Button
              to={addLink}
              component={Link}
              className="px-16 min-w-128"
              color="secondary"
              variant="contained"
              startIcon={
                <FuseSvgIcon className="" size={20}>
                  add
                </FuseSvgIcon>
              }
            >
              {addLinkText}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProductsHeader;
