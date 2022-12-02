const onSubmit = (e) => {
  console.log("submit");
  const email = e.response.getRespondentEmail();
  const responses = e.response.getItemResponses();
  let firstName = "";
  for (const res of responses) {
    const question = res.getItem().getTitle();
    if (question.trim() === "First Name") {
      firstName = res.getResponse().trim();
      break;
    }
  }
  console.log(
    `Bearer ${PropertiesService.getScriptProperties().getProperty(
      "MAIL_AUTH_TOKEN"
    )}`
  );
  UrlFetchApp.fetch("https://epochba-mail.mliu.workers.dev", {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${PropertiesService.getScriptProperties().getProperty(
        "MAIL_AUTH_TOKEN"
      )}`,
    },
    payload: JSON.stringify({
      email,
      textMessage: `Hey ${firstName}!

Thanks for registering for Epoch Bay Area <https://epochba.hackclub.com>; we're excited to see you there! In the next couple of weeks, we'll send out a mandatory waiver that you must sign to attend. For now, come hang out with other attendees (and suggest things you'd like to see at the hackathon) in the #epoch-ba <https://hackclub.slack.com/archives/C04AKL9UKEY> channel of the Hack Club Slack <https://hackclub.com/slack>.

We look forward to seeing you at Epoch Bay Area, on December 30th (9am - 9pm) at Circuit Launch (8000 Edgewater Dr., Ste. 200, Oakland, CA 94621)! We'll send out more updates through email and in the Slack, but reply to this email if you have any questions.

Happy Hacking!
The Epoch Bay Area Team`,
      htmlMessage: `<div>Hey ${firstName}!</div>
<br />
<div>
Thanks for registering for <a href="https://epochba.hackclub.com">Epoch Bay Area</a>; we're excited to see you there! In the next couple of weeks, we'll send out a mandatory waiver that you must sign to attend.
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
  });
};
