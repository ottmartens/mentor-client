import React from "react";
import styles from "./mentorGroupView.module.scss";
import { MentorGroupPreview } from "../../Components";

export default function MentorGroupView(){

    const groupName = "Testgrupp"
    const bio = "oleme coolid kiisumiisud, käime väljas jooksmas ja kasti pissimas. Whiskas is the best!"
    const persons = [
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
    ]

    const menteed = [
        {
            firstName: "Tere",
            lastName: "Terav",
            imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
        }
        ,
        {
            firstName: "Tarmo",
            lastName: "Sulane",
            imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
        }
        ,
        {
            firstName: "Jaan",
            lastName: "Tamm",
            imgUrl:
            "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
        }
    ]

    return  <div className={styles.alus}>
        <div className={styles.top}>
            <MentorGroupPreview
						key={groupName}
						persons={persons}
						groupName={groupName}
						bio={bio}
					/>
        </div>
        <div className={styles.bottom}>
            <h3>
                Approved mentees
            </h3>
            {menteed.map(({ firstName, lastName, imgUrl }) => {
          return (
              <div className={styles.mentee}>
                  <img className={styles.pilt} src={imgUrl} width="100px">
                  </img>
                  <div className={styles.name}>{`${firstName} ${lastName}`}
                  </div>
              </div>
          );
        })}
        </div>
    </div>
}