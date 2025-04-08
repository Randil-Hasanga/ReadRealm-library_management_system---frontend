import PropTypes from "prop-types";
import Icon from "./Icon";

const ReturnConfirmationDialog = ({ isOpen, onClose, onConfirm, type, bookName, borrowerName }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-2xl font-semibold text-green-500 mb-6">Return Confirmation</h2>
                        <Icon name="CornerUpLeft" size={35} />

                    </div>
                    <p className="text-gray-700 mb-4">Are you sure you want to return the {type} <strong>{bookName}</strong> Borrowed by <strong>{borrowerName}</strong>?</p>
                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="bg-green-600 text-white px-6 py-2 rounded-md"
                        >
                            Return
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

ReturnConfirmationDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    bookName: PropTypes.string.isRequired,
};

export default ReturnConfirmationDialog;