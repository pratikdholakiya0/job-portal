export const ProfileFormFields = ({ formData, handleChange, submitting }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                <input 
                    id="firstName"
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g., Jane"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                    required
                    disabled={submitting}
                />
            </div>

            <div>
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                <input 
                    id="lastName"
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g., Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                    required
                    disabled={submitting}
                />
            </div>
        </div>

        <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location (City, Country)</label>
            <input 
                id="location"
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                required
                disabled={submitting}
            />
        </div>
        
        <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input 
                id="phoneNumber"
                type="tel" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., +1 555-123-4567"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                required
                disabled={submitting}
            />
        </div>

        <div>
            <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">Professional Summary / Bio</label>
            <textarea 
                id="bio"
                name="bio"
                rows="5"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a brief summary of your skills and experience..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm resize-none"
                required
                disabled={submitting}
            />
        </div>
    </div>
);

export default ProfileFormFields