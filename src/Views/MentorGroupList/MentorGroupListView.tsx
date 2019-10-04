import React from "react";
import styles from "./mentorGroupList.module.scss";

export default function MentorGroupListView() {
  const groups = [
    {
      persons: [
        {
          firstName: "Priit",
          lastName: "Suur",
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
        },
        {
          firstName: "Kert",
          lastName: "Vana",
          imgUrl:
            "https://timesofindia.indiatimes.com/thumb/msid-67586673,width-800,height-600,resizemode-4/67586673.jpg"
        }
      ],
      groupName: "Pähklid",
      bio:
        "oleme coolid kiisumiisud, käime väljas jooksmas ja kasti pissimas. Whiskas is the best!"
    },
    {
      persons: [
        {
          firstName: "Janne",
          lastName: "Panne",
          imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
        },
        {
          firstName: "Punn",
          lastName: "Junn",
          imgUrl:
            "https://timesofindia.indiatimes.com/thumb/msid-67586673,width-800,height-600,resizemode-4/67586673.jpg"
        }
      ],
      groupName: "Murmurid",
      bio: "Käime joomas ja löömas!"
    }
  ];

  return (
    <div className={styles.mentorGroupListView}>
      {groups.map(({ persons, groupName, bio }) => {
        return (
          <div>
            <h1>{groupName}</h1>
            {persons.map(({ firstName, lastName, imgUrl }) => {
              return (
                <div>
                  <img src={imgUrl} alt={`${firstName} ${lastName}`} />
                  <div>{`${firstName} ${lastName}`}</div>
                </div>
              );
            })}
            <div>{bio}</div>
          </div>
        );
      })}
    </div>
  );
}
