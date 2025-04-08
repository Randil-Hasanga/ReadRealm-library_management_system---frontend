import PropTypes from "prop-types";

const Table = ({ columns, data, renderActions, isImportant }) => {
  return (
    <table className="w-full bg-white shadow-md rounded-xl overflow-hidden">
      <thead className={`text-md ${isImportant ? "bg-red-200" : "bg-orange-100"}`}>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="text-left p-4">
              {col.label}
            </th>
          ))}
          {renderActions && <th className="text-left p-4">Actions</th>}
        </tr>
      </thead>
      <tbody className="bg-white text-md">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="p-4">
                {row[col.field]}
              </td>
            ))}
            {renderActions && (
              <td className="p-4 flex space-x-2">
                {renderActions(row)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderActions: PropTypes.func,
};

Table.defaultProps = {
  renderActions: null,
};

export default Table;
