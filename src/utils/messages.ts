class message {
    // Error
    static PROVIDE_INPUT = `Please provide #`;
    static VALID_NUMBER = `Please provide #`;
    static VALID_INPUT = `Please provide valid #`;
    static MIN_NUMBER = `Latitude must be greater than or equal to $'`;
    static MAX_NUMBER = `Latitude must be less than or equal to $`;
    static UNAUTHORIZED_ACTION = 'You do not have the permission to access this resource.';
    static USER_NOTCONNECTED = 'You are not friends. Please connect first'
    // static UNMATCHED = 'Email or mobile already exists';
    static AUTHENTICATE = "Please authenticate";
    static INVALID_OTP = 'Invalid OTP';
    static INTEGER_INPUT = `Please provide # in numeric`;
    static NOT_FOUND = '# not found';
    static NOT_FOUND_URL = 'Bad request';
    static SERVICE_UNAVILABLE = 'The server is currently unavailable';
    static PROVIDE_USER_PASS = 'Please provide valid email and mobile number';
    static UPLOAD_FILE_ERROR = 'Error in uploading . Try again';
    static RECEIVER_NOT_FOUND = 'Receiver not available';
    static RECEIVER_GROUP_NOT_FOUND = 'Group not available';
    static LOGIN_ERROR = 'You need to first SignUp';
    static SIGNUP_ERROR = 'User already registered';
    static MOBILE_MIN = 'Mobile number must be at least 10 digits';
    static MOBILE_MAX = 'Mobile number must be at most 10 digits';
    static ID_MISSING = 'Country ID is not available.';
    static ALREADY_ADDED = `# Already Existing`;
    static ALREADY_SENT = 'Request already sent';
    static ALREADY_REPORT = 'User has already been reported';
    static REQUIRED_MSG = 'Message is required for reporting';
    static INVALID_ACTION = 'Invalid Action';
    static FAILED_UPDATE = 'Failed to update';
    static EMAIL_UPDATE = 'Email update successfully';
    static MOBILE_UPDATE = 'Mobile number update successfully';
    static NEW_OTP_SENT = 'OTP successfully sent to New mobile number';
    // static PASSWORD_PATTER = `Password must contain at least 1 uppercase letter, 1 special character, 1 number, and be at least 8 characters long`;
    
    // Success
    static USER_CREATED = 'User SignUp successfully';
    static USER_VERIFIED = 'User verified successfully';
    static OTP_SENT = 'OTP successfully sent to your mobile number';
    static OTP_RESENT = 'OTP successfully resent to your mobile number';
    static UPDATE_USER = 'Profile Updated successfully';
    static FOUND = '# found successfully';
    static CLEAR_CHAT = 'Successfully clear chats';
    static MESSAGE_SENT = 'Message sent successfully';
    static USER_LOGIN = '# Login Successfully';
    static COUNTRY_CREATED = 'Country Added successfully';
    static STATE_CREATED = 'State Added successfully';
    static CITY_CREATED = 'City Added successfully';
    static LANGUAGE_CREATED = 'Language Added successfully';
    static COUNTRY_UPDATE = 'Country Updated successfully';
    static STATE_UPDATE = 'State Updated successfully';
    static COUNTRY_DELETE = 'Country Deleted successfully';
    static STATE_DELETE = 'State Deleted successfully';
    static INTEREST_CREATE = 'Interest Added successfully';
    static INDUSTRY_CREATE = 'Industry Added successfully';
    static SESSION = 'Session established successfully';
    static REQUEST_ADD = 'Connection request sent successfully';
    static UPDATE_DATA = '# updated successfully';
    static NOTIFICATION_SENT = 'Notification sent successfully';
    static SUBSCRIBE_CREATE = 'Subscribed successfully';
    static LOGOUT = 'Logout successfully';
    static EXP_CREATED = 'Experience Added successfully';
    static USER_MANAGE = 'User manage success';
    static REQUEST_NOT_FOUND = '# not found';
}
export {
    message
}