import React from "react";
import styles from "./mentorGroupPreview.module.scss";

export default function MentorGroupPreview({ persons, groupName, bio }) {
  return (
    <div className={styles.mentorGroupPreview}>
      <h1 className={styles.title}>{groupName}</h1>
      <div className={styles.persons}>
        {persons.map(({ firstName, lastName, imgUrl }) => {
          return (
            <div key={`${firstName} ${lastName}`} className={styles.person}>
              <div >
                <img className={styles.image} src={imgUrl} alt={`${firstName} ${lastName}`} />
              </div>
              <div className={styles.name}>{`${firstName} ${lastName}`}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.bio}>{bio}</div>
      <div className={styles.button}>
        <button>Apply</button>
      </div>
    </div>
  );
}
