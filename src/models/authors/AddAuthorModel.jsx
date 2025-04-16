import { useState } from "react";

const AddAuthorModal = ({ isOpen, onClose, onSubmit }) => {
    const [author, setAuthor] = useState({
        author_name: "",
    });

    const handleChange = (e) => {
        setAuthor({ author_name: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...author });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Author</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Author Name</label>
                            <input
                                type="text"
                                name="author_name"
                                value={author.author_name}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
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
                                Add Author
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddAuthorModal;