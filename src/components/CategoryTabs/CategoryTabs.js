const CategoryTabs = ({ category, onChange }) => {
    return (
      <div className = "tab">
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
        <CategoryButton
          label="View Flagged Users"
          categoryId="FLAGUSER"
          onClick={onChange}
        />
        <CategoryButton
          label="View Flagged RSNs"
          categoryId="FLAGRSN"
          onClick={onChange}
        />
      </div>
    );
  };
  const CategoryButton = ({ label, categoryId, onClick }) => {
    return <button onClick={() => onClick(categoryId)}>{label}</button>;
  };

  export default CategoryTabs