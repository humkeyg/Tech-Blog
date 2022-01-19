async function commentsFormHandler(event) {
  event.preventDefault();

  const comments_text = document.querySelector('input[name="comments-body"]').value.trim();

  const blog_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
  ];

  if (comments_text) {
      const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
              blog_id,
              comments_text
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          document.location.reload();

      } else {
          alert(response.statusText);
          document.querySelector('#comments-form').style.display = "block";
      }
  }
}

document.querySelector('.comments-form').addEventListener('submit', commentsFormHandler);