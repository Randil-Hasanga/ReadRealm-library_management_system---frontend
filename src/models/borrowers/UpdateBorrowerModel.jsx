import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UpdateBorrowerModal = ({ isOpen, onClose, onSubmit, borrower }) => {
    const [updatedBorrower, setUpdatedBorrower] = useState({
        fname: "",
        lname: "",
        NIC: "",
        email: "",
        contact_no: "",
        address: "",
    });

    // Populate form when modal opens
    useEffect(() => {
        if (borrower && isOpen) {
            const [fname, ...rest] = borrower.BorrowerFullName?.split(" ") || [];
            const lname = rest.join(" ");
            setUpdatedBorrower({
                fname: fname || "",
                lname: lname || "",
                NIC: borrower.NIC || "",
                email: borrower.email || "",
                contact_no: borrower.contact_no || "",
                address: borrower.address || "",
            });
        }
    }, [isOpen, borrower]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedBorrower((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(updatedBorrower);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Borrower</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="fname"
                                value={updatedBorrower.fname}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lname"
                                value={updatedBorrower.lname}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">NIC</label>
                            <input
                                type="text"
                                name="NIC"
                                value={updatedBorrower.NIC}
                                readOnly
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={updatedBorrower.email}
                                readOnly
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="contact_no"
                                value={updatedBorrower.contact_no}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                name="address"
                                value={updatedBorrower.address}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
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
                                className="bg-blue-600 text-white px-6 py-2 rounded-md"
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
UpdateBorrowerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    borrower: PropTypes.shape({
        fname: PropTypes.string.isRequired,
        lname: PropTypes.string.isRequired,
        NIC: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        contact_no: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired,
};

export default UpdateBorrowerModal;
