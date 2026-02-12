exports.handler = async function () {
  const siteId = process.env.SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;

  try {
    // フォーム一覧取得
    const formsRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/forms`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const forms = await formsRes.json();
    const gameForm = forms.find(f => f.name === "game");

    if (!gameForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Form not found" })
      };
    }

    // 投稿一覧取得
    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${gameForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const submissions = await submissionsRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(submissions)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
