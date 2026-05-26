export const SELECTORS = {
  login: {
    emailInput: 'input#email',
    passwordInput: 'input#password',
    signInButton: '#sign-in-btn',
    xeroSignInButton: '#sign-in-with-xero-btn',
    leftLogo: 'twp-svg-icon[name="workpapers-sorted-logo"]',
    leftHeading: 'h1:has-text("Welcome to Workpapers Sorted")',
    leftDescription: 'p:has-text("Workpapers Sorted by Cloudoffis streamlines")',
    rightHeading: 'h1:has-text("Sign In to Workpapers Sorted!")',
    rightSubHeading: 'span:has-text("Use your credentials to continue with Workpapers Sorted")',
    forgotPasswordLink: 'a.forgot-password',
  },
  mfa: {
    codeInput: 'input[name="code"], input[type="text"].code-input, #code, input[formcontrolname="code"]',
    trustDeviceCheckbox: 'input[type="checkbox"], #trust-device, label:has-text("Trust this device")',
    trustDeviceInfoIcon: '.info-icon, .fa-info-circle, text="info", [name*="info"], twp-svg-icon[name*="info"]',
    trustDeviceTooltip: '.tooltip, .tooltip-content, .popover, text=/Temporarily skip/i',
    trustDeviceTooltipClose: '.tooltip-close, .close-btn, text="X", .tooltip x-icon',
    confirm2FAButton: 'button:has-text("Confirm"), #confirm-btn, button[type="submit"]',
  },
  errors: {
    fieldErrors: '.invalid-feedback, .error-message, .p-error, small.text-danger',
    toastError: '.p-toast-message-content, .toast-message, .toast-error, .alert-danger',
  },
  registration: {
    usernameInput: 'input#username',
    emailInput: 'input#email',
    passwordInput: 'input#password',
    confirmPasswordInput: 'input#confirm-password',
    registerButton: 'button[type="submit"], #register-btn',
  },
};
