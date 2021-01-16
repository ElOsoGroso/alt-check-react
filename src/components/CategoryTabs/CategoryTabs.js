const CategoryTabs = ({ category, onChange }) => {
    return (
      <div>
        <CategoryButton
          label="Search by Username"
          categoryId="USER"
          onClick={onChange}
        />
        <CategoryButton
          label="Search by RSN"
          categoryId="RSN"
          onClick={onChange}
        />
      </div>
    );
  };
  const CategoryButton = ({ label, categoryId, onClick }) => {
    return <button onClick={() => onClick(categoryId)}>{label}</button>;
  };

  export default CategoryTabs