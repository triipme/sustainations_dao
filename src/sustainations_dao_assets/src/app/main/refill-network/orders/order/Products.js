import _ from 'lodash';
import { useState, useEffect } from "react";
import ProductsHeader from '../../products/ProductsHeader';
import ProductsTable from './ProductsTable';

const Products = (props) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { products, categories, selectedProductIds, onSelectProduct, error } = props;

  useEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0 && selectedCategory === 'all') {
        return products;
      }
      return _.filter(products, (item) => {
        if (selectedCategory !== 'all' && !_.includes(item.categories, selectedCategory)) {
          return false;
        }
        return item.name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (products) {
      setFilteredData(getFilteredArray());
    }
  }, [products, searchText, selectedCategory]);

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  return (
    <>
      <ProductsHeader
        handleSearchText={handleSearchText} categories={categories}
        selectedCategory={selectedCategory} handleSelectedCategory={handleSelectedCategory}
        searchPlaceholder="Search products" title="Select Products" titleClass="text-2xl"
      />
      <ProductsTable
          data={filteredData} onSelectProduct={onSelectProduct}
          selectedProductIds={selectedProductIds} error={error}
        />
    </>
  );
}

export default Products;
