import { checkToken } from "@lib/checkToken";
import { Payload } from "@lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@lib/getPrisma";

export const GET = async () => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  // Type casting to "Payload" and destructuring to get data
  const { role, studentId } = <Payload>payload;

  if (role === "ADMIN") {
    return NextResponse.json(
      {
        ok: true,
        message: "Only Student can access this API route",
      },
      { status: 403 }
    );
  }

  const prisma = getPrisma();

  // get courses but no title
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: studentId },
    include: { course: true },
  });

  // console.log(enrollments);

  return NextResponse.json({
    ok: true,
    enrollments: enrollments,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  const { role, studentId } = <Payload>payload;

  if (role === "ADMIN") {
    return NextResponse.json(
      {
        ok: true,
        message: "Only Student can access this API route",
      },
      { status: 403 }
    );
  }

  //read body request
  const body = await request.json();
  const { courseNo } = body;
  if (typeof courseNo !== "string" || courseNo.length !== 6) {
    return NextResponse.json(
      {
        ok: false,
        message: "courseNo must contain 6 characters",
      },
      { status: 400 }
    );
  }
  const prisma = getPrisma();
  const courses = await prisma.course.findUnique({
    where: { courseNo: courseNo }
  });

  if(!courses){
    return NextResponse.json(
      {
        ok: false,
        message: "Course number does not exist",
      },
      { status: 400 }
    );
  }

  const enrollments = await prisma.enrollment.findUnique({
    where:{courseNo_studentId:{courseNo:courseNo, studentId:studentId}}
  });
  if(enrollments){
    return NextResponse.json(
      {
        ok: false,
        message: "You already registered this course",
      },
      { status: 400 }
    );
  }

  await prisma.enrollment.create({
    data: {
      courseNo: courseNo,
      studentId: studentId
    }
  })
  // Coding in lecture

  return NextResponse.json({
    ok: true,
    message: "You has enrolled a course successfully",
  });
};

// Need review together with drop enrollment form.
export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  const { role, studentId } = <Payload>payload;

  if (role === "ADMIN") {
    return NextResponse.json(
      {
        ok: true,
        message: "Only Student can access this API route",
      },
      { status: 403 }
    );
  }

  // read body request ***
  const body = await request.json();
  const { courseNo } = body;
  if (typeof courseNo !== "string" || courseNo.length !== 6) {
    return NextResponse.json(
      {
        ok: false,
        message: "courseNo must contain 6 characters",
      },
      { status: 400 }
    );
  }

  const prisma = getPrisma();
  await prisma.enrollment.delete({
    where:{courseNo_studentId:{courseNo:courseNo, studentId:studentId}}
  }
  )
  // Perform data delete

  return NextResponse.json({
    ok: true,
    message: "You has dropped from this course. See you next semester.",
  });
};
