(() => {
  const form=document.querySelector('#contact-draft');
  if(!form)return;
  form.hidden=false;
  const page=form.querySelector('#contact-page');
  const from=new URLSearchParams(location.search).get('page');
  if(from){try{const url=new URL(from,location.origin);if(url.origin===location.origin)page.value=url.href;}catch{/* Optional context may be omitted. */}}
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const topic=form.querySelector('#contact-topic').value;
    const message=form.querySelector('#contact-message').value.trim();
    if(!message){form.querySelector('#contact-message').setCustomValidity('Please enter your message.');form.reportValidity();return;}
    const body=`Page: ${page.value||'Not specified'}\n\n${message}\n\nSource / edition / chapter or verse (if relevant):\n`;
    location.href=`mailto:shreembala@gmail.com?subject=${encodeURIComponent('Sanatan Heritage — '+topic)}&body=${encodeURIComponent(body)}`;
    form.querySelector('#contact-status').textContent='Your email app has been requested. If no draft opens, email shreembala@gmail.com directly. Nothing has been sent yet.';
  });
  form.querySelector('#contact-message').addEventListener('input',event=>event.target.setCustomValidity(''));
})();
