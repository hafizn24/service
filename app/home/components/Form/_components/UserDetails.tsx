interface FormData {
    name: string;
    email: string;
    phone: string;
    hostel: string;
    numberPlate: string;
    brandModel: string;
    productPackage: string;
    timeslot: string;
    receipt: File | null;
}

interface UserDetailsProps {
    formData: FormData;
    updateField: (field: keyof FormData, value: string) => void;
    onNext: () => void;
}

function UserDetails({ formData, updateField, onNext }: UserDetailsProps) {
    return (
        <div className="space-y-6">
            <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            <input
                type="text"
                placeholder="Hostel's Name"
                value={formData.hostel}
                onChange={(e) => updateField("hostel", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            <input
                type="text"
                placeholder="Number Plate Vehicle"
                value={formData.numberPlate}
                onChange={(e) => updateField("numberPlate", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            <input
                type="text"
                placeholder="Brand Model"
                value={formData.brandModel}
                onChange={(e) => updateField("brandModel", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            <select
                value={formData.productPackage}
                onChange={(e) => updateField("productPackage", e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2"
            >
                <option value="" disabled>
                    Select Product and Package
                </option>
                <option value="daily">Daily Use Package</option>
                <option value="performance">Performance Package</option>
            </select>

            <button
                type="button"
                onClick={onNext}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
                Next
            </button>
        </div>
    );
}

export default UserDetails;
