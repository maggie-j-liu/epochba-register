const getProperty = (propertyName) =>
  PropertiesService.getScriptProperties().getProperty(propertyName);

const onSubmit = (e) => {
  const email = e.response.getRespondentEmail();
  const responses = e.response.getItemResponses();
  let firstName;
  let lastName;
  let parentName;
  let parentEmail;
  let age;
  for (const res of responses) {
    const question = res.getItem().getTitle();
    if (question.trim() === "First Name") {
      firstName = res.getResponse().trim();
    } else if (question.trim() === "Last Name") {
      lastName = res.getResponse().trim();
    } else if (question.trim() === "Parent/Guardian Name") {
      parentName = res.getResponse().trim();
    } else if (question.trim() === "Parent/Guardian Email") {
      parentEmail = res.getResponse().trim();
    } else if (question.trim() === "Age") {
      age = parseInt(res.getResponse().trim());
    }
  }
  const sendEmail = {
    url: "https://epochba-mail.mliu.workers.dev",
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${getProperty("MAIL_AUTH_TOKEN")}`,
    },
    payload: JSON.stringify({
      email,
      textMessage: `Hey ${firstName}!

Thanks for registering for Epoch Bay Area <https://epochba.hackclub.com>; we're excited to see you there! You should have received an email asking you to sign our event liability waiver -- you must sign this to attend.${
        age < 18
          ? " Once you sign, your parent/guardian will receive an email to sign and complete the rest of the waiver."
          : ""
      }

For now, come hang out with other attendees (and suggest things you'd like to see at the hackathon) in the #epoch-ba <https://hackclub.slack.com/archives/C04AKL9UKEY> channel of the Hack Club Slack <https://hackclub.com/slack>.

We look forward to seeing you at Epoch Bay Area, on December 30th (9am - 9pm) at Circuit Launch (8000 Edgewater Dr., Ste. 200, Oakland, CA 94621)! We'll send out more updates through email and in the Slack, but reply to this email if you have any questions.

Happy Hacking!
The Epoch Bay Area Team`,
      htmlMessage: `<div>Hey ${firstName}!</div>
<br />
<div>
Thanks for registering for <a href="https://epochba.hackclub.com">Epoch Bay Area</a>; we're excited to see you there! You should have received an email asking you to sign our event liability waiver -- you must sign this to attend.${
        age < 18
          ? " Once you sign, your parent/guardian will receive an email to sign and complete the rest of the waiver."
          : ""
      }
</div>
<br />
<div>
For now, come hang out with other attendees (and suggest things you'd like to see at the hackathon) in the <a href="https://hackclub.slack.com/archives/C04AKL9UKEY">#epoch-ba</a> channel of the <a href="https://hackclub.com/slack">Hack Club Slack</a>.
</div>
<br />
<div>
We look forward to seeing you at Epoch Bay Area, on December 30th (9am - 9pm) at Circuit Launch (<a href="https://goo.gl/maps/NzU8Vy29XPRyFdN46">8000 Edgewater Dr., Ste. 200, Oakland, CA 94621</a>)! We'll send out more updates through email and in the Slack, but reply to this email if you have any questions.
</div>
<br />
<div>
Happy Hacking!
</div>
<div>
The Epoch Bay Area Team
</div>`,
      subject: "🌉 See you at Epoch Bay Area!",
    }),
  };

  const waiver = {
    url: age < 18 ? getProperty("MINOR_WAIVER") : getProperty("ADULT_WAIVER"),
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(
      age < 18
        ? {
            roles: {
              Participant: {
                email,
                name: `${firstName} ${lastName}`,
              },
              Parent: {
                email: parentEmail,
                name: parentName,
              },
            },
          }
        : {
            roles: {
              Participant: {
                email,
                name: `${firstName} ${lastName}`,
              },
            },
          }
    ),
  };
  UrlFetchApp.fetchAll([sendEmail, waiver]);
};
