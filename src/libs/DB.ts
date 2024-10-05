import _ from "lodash";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import fs from "fs";

const originalDB = {
  students: [
    {
      studentId: "650610001",
      firstName: "Matt",
      lastName: "Damon",
      program: "CPE",
    },
    {
      studentId: "650610002",
      firstName: "Cillian",
      lastName: "Murphy",
      program: "CPE",
    },
    {
      studentId: "650610003",
      firstName: "Emily",
      lastName: "Blunt",
      program: "ISNE",
    },
  ],
  courses: [
    {
      courseNo: "261207",
      title: "BASIC COMP ENGR LAB",
    },
    {
      courseNo: "001101",
      title: " FUNDAMENTAL ENGLISH 1",
    },
    {
      courseNo: "001102",
      title: " FUNDAMENTAL ENGLISH 2",
    },
    {
      courseNo: "001103",
      title: " FUNDAMENTAL ENGLISH 3",
    },
  ],
  enrollments: [
    {
      studentId: "650610001",
      courseNo: "261207",
    },
    {
      studentId: "650610001",
      courseNo: "001101",
    },
    {
      studentId: "650610002",
      courseNo: "261207",
    },
  ],
  users: [
    {
      username: "user1",
      password: "$2a$12$7FtHF7AMxOM22CswdaOGC.Fk5Ps70qdonb6IltdbvQxbkjHBW76Cy",
      studentId: "650610001",
      role: "STUDENT",
    },
    {
      username: "user2",
      password: "$2a$12$vOLfbveE.deopFnzc5fxz.4u5NenVsR.PzRgYZJL1TfJZHCpR61xa",
      studentId: "650610002",
      role: "STUDENT",
    },
    {
      username: "user3",
      password: "$2a$12$xXxB75GMg2avBEWjVbUdH.7qqQZhSAqlyXjuKgYEdf0R7KXWQLNKG",
      studentId: "650610003",
      role: "STUDENT",
    },
    {
      username: "user4",
      password: "$2a$12$dy5V3ihtIDNhzMFHbJ.tXO1jSfMy.mZ8V67N8onEjAqtGXVFqoIV2",
      studentId: null,
      role: "ADMIN",
    },
  ],
};

const onProduction = process.env.NODE_ENV === "production";

const adapter = new JSONFileSync("DatabaseFile.json");

let lowDB = new LowSync(adapter, originalDB);
if (!fs.existsSync("DatabaseFile.json")) {
  lowDB.write();
}

export let DB = onProduction ? _.cloneDeep(originalDB) : lowDB.data;

export function resetDB() {
  if (onProduction) {
    DB = _.cloneDeep(originalDB);
  } else {
    lowDB = new LowSync(adapter, originalDB);
    DB = lowDB.data;
    lowDB.write();
  }
}

export function readDB() {
  if (!onProduction) {
    lowDB.read();
    DB = lowDB.data;
  }
}

export function writeDB() {
  if (!onProduction) {
    lowDB.write();
  }
}
