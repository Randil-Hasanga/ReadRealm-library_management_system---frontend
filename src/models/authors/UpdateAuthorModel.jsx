import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UpdateAuthorModal = ({ isOpen, onClose, onSubmit, author }) => {
    const [authorName, setAuthorName] = useState("");

    // Populate form when modal opens
    useEffect(() => {
        if (author && isOpen) {
            setAuthorName(author.author_name || "");
        }
    }, [isOpen, author]);

    const handleChange = (e) => {
        setAuthorName(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ author_name: authorName });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Author</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Author Name</label>
                            <input
                                type="text"
                                name="author_name"
                                value={authorName}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-6 py-2 rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

// PropTypes validation
UpdateAuthorModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    author: PropTypes.shape({
        author_name: PropTypes.string.isRequired,
    }).isRequired,
};

export default UpdateAuthorModal;