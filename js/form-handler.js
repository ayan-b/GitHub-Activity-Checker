// credits : https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server

const SHOW_DEBUG = true;
(function () {
  function validEmail(email) { // see:
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  function validateHuman(honeypot) {
    if (honeypot) { // if hidden form filled up
      if (SHOW_DEBUG) console.log('Robot Detected!');
      return true;
    } if (SHOW_DEBUG) console.log('Welcome Human!');
    return false;
  }

  function disableAllButtons(form) {
    const buttons = form.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i += 1) {
      buttons[i].disabled = true;
    }
  }

  // get all data in form and return object
  function getFormData() {
    const form = document.getElementById('gform');
    const { elements } = form; // all form elements
    const fields = Object.keys(elements).filter(k => (elements[k].name !== 'honeypot')).map((k) => {
      if (elements[k].name !== undefined) {
        return elements[k].name;
        // special case for Edge's html collection
      } if (elements[k].length > 0) {
        return elements[k].item(0).name;
      }
    }).filter((item, pos, self) => self.indexOf(item) === pos && item);
    const data = {};
    fields.forEach((k) => {
      data[k] = elements[k].value;
      let str = ''; // declare empty string outside of loop to allow
      // it to be appended to for each item in the loop
      if (elements[k].type === 'checkbox') { // special case for Edge's html collection
        str = `${str + elements[k].checked}, `; // take the string and append
        // the current checked value to
        // the end of it, along with
        // a comma and a space
        data[k] = str.slice(0, -2); // remove the last comma and space
        // from the  string to make the output
        // prettier in the spreadsheet
      } else if (elements[k].length) {
        for (let i = 0; i < elements[k].length; i += 1) {
          if (elements[k].item(i).checked) {
            str = `${str + elements[k].item(i).value}, `; // same as above
            data[k] = str.slice(0, -2);
          }
        }
      }
    });

    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || 'responses'; // default sheet name
    data.formGoogleSendEmail = form.dataset.email || ''; // no email by default
    if (SHOW_DEBUG) console.log(data);
    return data;
  }

  function handleFormSubmit(event) { // handles form submit without any jquery
    event.preventDefault(); // we are submitting via xhr below
    const data = getFormData(); // get the values submitted in the form

    if (validateHuman(data.honeypot)) { // if form is filled, form will not be submitted
      return false;
    }

    if (data.email && !validEmail(data.email)) { // if email is not valid show error
      const invalidEmail = document.getElementById('email-invalid');
      if (invalidEmail) {
        invalidEmail.style.display = 'block';
        return false;
      }
    } else {
      disableAllButtons(event.target);
      const url = event.target.action; //
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function () {
        if (SHOW_DEBUG) {
          console.log(xhr.status, xhr.statusText);
          console.log(xhr.responseText);
        }
        document.getElementById('gform').style.display = 'none'; // hide form
        const thankYouMessage = document.getElementById('thankyou_message');
        if (thankYouMessage) {
          thankYouMessage.style.display = 'block';
        }
      };
      // url encode form data for sending as post data
      const encoded = Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
      xhr.send(encoded);
    }
  }
  function loaded() {
    if (SHOW_DEBUG) console.log('Contact form submission handler loaded successfully.');
    // bind to the submit event of our form
    const form = document.getElementById('gform');
    form.addEventListener('submit', handleFormSubmit, false);
  }
  document.addEventListener('DOMContentLoaded', loaded, false);
}());
