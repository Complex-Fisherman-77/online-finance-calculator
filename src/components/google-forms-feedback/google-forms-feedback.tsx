import './google-forms-feedback.css';

function GoogleFormsFeedback() {
    const formLink = 'https://docs.google.com/forms/d/e/1FAIpQLSfFOIM1Yv-wm9rWxQB2h5egliEJN3rxXE_P562ZfApqIsxeew/viewform?usp=header';

    return (
        <div className="feedback-corner">
        <a
            href={formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-button"
            title='Please give me feedback, bugs, suggestions and new features!'
        >
            Feedback
        </a>
        </div>
      );
}

export default GoogleFormsFeedback;