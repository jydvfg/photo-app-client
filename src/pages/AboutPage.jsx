import React from "react";

const About = () => {
  return (
    <div className="content">
      <img src="https://res.cloudinary.com/dywpr7p7g/image/upload/v1710064786/dqcjyod3tv1htogyg0ii.png" style={{height:"200px", }}/>

      <h2>About El Sexo</h2>
      <p>
        El Sexo is a photography sharing app that puts pictures and
        photographers front and center. Unlike other social media platforms,
        there are no follows or likes; instead, users are encouraged to save the
        pictures they like.
      </p>
      <p>
        The app's feed refreshes every 24 hours, presenting a new set of
        pictures and creating an ephemeral photography exhibition every day.
        Once the pictures are gone, they're gone, emphasizing the importance of
        saving the ones you enjoy.
      </p>
      <p>
        Users can view and engage with each other's work, leaving positive
        comments and interacting with the content. Pictures are displayed based
        on proximity to the user, providing a dynamic photographic experience.
      </p>
      <p>
        To avoid content overload, users are limited to uploading one picture
        per day, creating space for a diverse range of content while ensuring
        each image receives attention.
      </p>
      <h3>Terms and Conditions</h3>
      <p>
        By using El Sexo, you agree to share your location data for the purpose
        of rendering the main feed based on proximity. All content uploaded must
        adhere to our guidelines, with the exception of minors or any content
        promoting hate speech.
      </p>
      <p>
        The app allows for artistic freedom, but inappropriate content may be
        flagged and removed by the admin. The feed refreshes daily, and comments
        are enabled to encourage interaction among users.
      </p>
      <p>
        Your participation in testing the app is greatly appreciated, and your
        contributions will help enhance the overall experience for all users.
      </p>
    </div>
  );
};

export default About;
