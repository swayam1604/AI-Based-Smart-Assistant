"""
Training Data for AI Ticket Classifier
Contains labeled examples for each support category
"""

TRAINING_DATA = [
    # ──────────────────────────────────────────────────────
    # CATEGORY: Payment Issues
    # ──────────────────────────────────────────────────────
    ("My payment failed and money was deducted from my account", "Payment Issues"),
    ("I was charged twice for the same order", "Payment Issues"),
    ("I need a refund for my last transaction", "Payment Issues"),
    ("My credit card is not being accepted", "Payment Issues"),
    ("The payment gateway is showing an error", "Payment Issues"),
    ("I cannot process my payment online", "Payment Issues"),
    ("My invoice shows wrong amount", "Payment Issues"),
    ("I want to dispute a charge on my bill", "Payment Issues"),
    ("Refund has not been credited to my account", "Payment Issues"),
    ("I was billed for a cancelled subscription", "Payment Issues"),
    ("Payment is pending since 3 days", "Payment Issues"),
    ("My UPI payment failed but money is debited", "Payment Issues"),
    ("I need to change my payment method", "Payment Issues"),
    ("Transaction declined by bank", "Payment Issues"),
    ("Wrong amount charged to my card", "Payment Issues"),
    ("I want to cancel auto-renewal and get refund", "Payment Issues"),
    ("My wallet balance did not update after payment", "Payment Issues"),
    ("Cashback not received after successful payment", "Payment Issues"),
    ("Payment timeout occurred but money debited", "Payment Issues"),
    ("I need tax invoice for my purchase", "Payment Issues"),

    # ──────────────────────────────────────────────────────
    # CATEGORY: Technical Support
    # ──────────────────────────────────────────────────────
    ("The app keeps crashing whenever I open it", "Technical Support"),
    ("I cannot log into my account", "Technical Support"),
    ("The website is not loading properly", "Technical Support"),
    ("My data is not syncing across devices", "Technical Support"),
    ("I am getting a 500 internal server error", "Technical Support"),
    ("The mobile app is very slow and laggy", "Technical Support"),
    ("I cannot upload files on your platform", "Technical Support"),
    ("My notifications are not working", "Technical Support"),
    ("The search feature is not returning results", "Technical Support"),
    ("I cannot download my files", "Technical Support"),
    ("Video is not playing on your website", "Technical Support"),
    ("Two factor authentication is not working", "Technical Support"),
    ("I keep getting logged out automatically", "Technical Support"),
    ("The dark mode setting is not saving", "Technical Support"),
    ("API integration is returning errors", "Technical Support"),
    ("I cannot connect to your servers", "Technical Support"),
    ("Email verification link is not working", "Technical Support"),
    ("The app is consuming too much battery", "Technical Support"),
    ("My profile picture is not updating", "Technical Support"),
    ("Browser extension is not functioning", "Technical Support"),

    # ──────────────────────────────────────────────────────
    # CATEGORY: Account Problems
    # ──────────────────────────────────────────────────────
    ("I forgot my password and cannot reset it", "Account Problems"),
    ("My account has been locked", "Account Problems"),
    ("I want to delete my account permanently", "Account Problems"),
    ("Someone else is using my account", "Account Problems"),
    ("I cannot update my email address", "Account Problems"),
    ("My account was suspended without reason", "Account Problems"),
    ("I need to recover my old account", "Account Problems"),
    ("I cannot change my username", "Account Problems"),
    ("My subscription was cancelled unexpectedly", "Account Problems"),
    ("I want to merge two accounts", "Account Problems"),
    ("I cannot verify my phone number", "Account Problems"),
    ("My account data is missing", "Account Problems"),
    ("I want to change my account email", "Account Problems"),
    ("I cannot access my account from a new device", "Account Problems"),
    ("My profile information is incorrect", "Account Problems"),
    ("I did not receive the account activation email", "Account Problems"),
    ("I want to upgrade my account plan", "Account Problems"),
    ("My account was hacked", "Account Problems"),
    ("I want to transfer my account to another person", "Account Problems"),
    ("I cannot close my account", "Account Problems"),

    # ──────────────────────────────────────────────────────
    # CATEGORY: Product Complaints
    # ──────────────────────────────────────────────────────
    ("The product I received is damaged", "Product Complaints"),
    ("This product stopped working after one week", "Product Complaints"),
    ("The product does not match what was advertised", "Product Complaints"),
    ("I received a wrong item in my order", "Product Complaints"),
    ("Product quality is very poor", "Product Complaints"),
    ("The item is missing parts from the box", "Product Complaints"),
    ("Product broke down after first use", "Product Complaints"),
    ("The color of the product is different than shown", "Product Complaints"),
    ("I am not satisfied with the product features", "Product Complaints"),
    ("The product manual is confusing and incorrect", "Product Complaints"),
    ("Product size does not match the description", "Product Complaints"),
    ("The packaging was damaged on arrival", "Product Complaints"),
    ("Product has a manufacturing defect", "Product Complaints"),
    ("The product expired before the expiry date shown", "Product Complaints"),
    ("This product is not working as advertised", "Product Complaints"),
    ("I want to return this defective product", "Product Complaints"),
    ("Product has a safety issue", "Product Complaints"),
    ("The product smells bad", "Product Complaints"),
    ("Product is not compatible as stated", "Product Complaints"),
    ("I want a replacement for this broken product", "Product Complaints"),

    # ──────────────────────────────────────────────────────
    # CATEGORY: Service Requests
    # ──────────────────────────────────────────────────────
    ("I want to upgrade my subscription plan", "Service Requests"),
    ("Can you help me set up my account", "Service Requests"),
    ("I need training on how to use your product", "Service Requests"),
    ("I want to request a custom feature", "Service Requests"),
    ("Can I get a demo of your premium plan", "Service Requests"),
    ("I want to add more users to my account", "Service Requests"),
    ("Please help me migrate my data", "Service Requests"),
    ("I need assistance with onboarding", "Service Requests"),
    ("Can you provide API documentation", "Service Requests"),
    ("I want to schedule a call with your team", "Service Requests"),
    ("I need help configuring my settings", "Service Requests"),
    ("Can you extend my free trial period", "Service Requests"),
    ("I want to request a custom report", "Service Requests"),
    ("Please help me integrate with third party tools", "Service Requests"),
    ("I need a dedicated account manager", "Service Requests"),
    ("Can you whitelist my IP address", "Service Requests"),
    ("I want to request early access to new features", "Service Requests"),
    ("Please help me with bulk data import", "Service Requests"),
    ("I need to set up SSO for my organization", "Service Requests"),
    ("Can you provide SLA documentation", "Service Requests"),
]


def get_training_texts():
    """Return list of training texts."""
    return [item[0] for item in TRAINING_DATA]


def get_training_labels():
    """Return list of training labels."""
    return [item[1] for item in TRAINING_DATA]


def get_categories():
    """Return list of unique categories."""
    return list(set(item[1] for item in TRAINING_DATA))


# Smart response templates for each category
RESPONSE_TEMPLATES = {
    "Payment Issues": [
        "Thank you for reaching out about your payment issue. I completely understand how frustrating this can be. Our payment team will investigate this immediately and ensure your concern is resolved within 24-48 hours. If a refund is due, it will be processed to your original payment method.",
        "I sincerely apologize for the payment inconvenience. We take billing issues very seriously. I've escalated your case to our billing department with high priority. You will receive a detailed update via email within 24 hours.",
        "We're sorry to hear about your payment problem. Our system shows your transaction details and we are already looking into it. Rest assured, any incorrect charge will be reversed immediately. Please keep your transaction reference number handy.",
    ],
    "Technical Support": [
        "Thank you for reporting this technical issue. Our engineering team has been notified and is investigating. As a first step, please try clearing your browser cache and refreshing. If the issue persists, we'll escalate to our technical team who will contact you within 2-4 hours.",
        "I apologize for the technical difficulties you're experiencing. Our team is actively working on a fix. Could you please share your device type and browser version? This will help us diagnose and resolve the issue faster. We aim to have this resolved within 4 hours.",
        "We understand how critical this technical issue is for you. Our senior technical team has been alerted. As a temporary workaround, please try using a different browser or device. We'll provide a permanent fix within the next few hours.",
    ],
    "Account Problems": [
        "I'm sorry to hear you're having trouble with your account. Account security is our top priority. I've initiated an account review on your behalf. You'll receive an email with recovery steps within 15 minutes. Please check your spam folder as well.",
        "Thank you for bringing this account issue to our attention. I've flagged your account for immediate review by our security team. For your protection, please do not share your credentials with anyone. We'll have this resolved within 1 hour.",
        "I understand how important account access is to you. Our account recovery team is now handling your case with high priority. Please check your registered email for instructions. If you don't receive them in 30 minutes, please reply to this ticket.",
    ],
    "Product Complaints": [
        "I sincerely apologize for the product issue you've experienced. This is definitely not the quality we stand behind. I've initiated a replacement/refund request on your behalf. Our quality team will also investigate this to prevent it from happening to other customers.",
        "Thank you for letting us know about this product problem. I'm truly sorry for your experience. We have a 30-day replacement policy and I'm happy to process a replacement or full refund for you immediately. Could you share a photo of the defect?",
        "We take product quality very seriously and I'm sorry this didn't meet your expectations. I've escalated your complaint to our product quality team. We'll arrange either a replacement or a full refund based on your preference. Someone from our team will contact you within 24 hours.",
    ],
    "Service Requests": [
        "Thank you for your service request! I'm happy to assist you with this. Our team will review your request and get back to you with all the details within 2-4 hours. We're excited to help you get the most out of our platform.",
        "Great to hear from you! Your service request has been received and assigned to our specialist team. They will reach out to you within 1 business day to discuss the best solution for your needs.",
        "Thank you for your interest! I've forwarded your service request to the relevant department. You'll receive a detailed response including pricing, timelines, and next steps within 24 hours. Is there any additional information you'd like to share?",
    ],
}