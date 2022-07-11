const newFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_content = document.querySelector('textarea[name="post-content"]').value.trim();

    const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_content
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/profile')
    } else {
        alert(response.statusText)
    }
};

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);