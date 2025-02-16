
// make a get request to coursesList endpoint and use the result to spawn a new CourseList component
// and append it to the courses container
function getCourses() {
    $.get("http://localhost:3000/coursesList", function(data) {
        spawnCourseItems(data);
    })
}

function createCourseItem(courseName, courseId) {
    const courseItem = document.createElement('div');
    courseItem.className = 'flex w-full p-4';

    const courseNameDiv = document.createElement('div');
    courseNameDiv.className = 'course-name flex-2';
    courseNameDiv.textContent = courseName;

    const courseIdDiv = document.createElement('div');
    courseIdDiv.className = 'course-id text-left flex-1';
    courseIdDiv.textContent = courseId;

    const removeIconDiv = document.createElement('div');
    removeIconDiv.className = 'remove-icon text-grey-400 hover:text-red-700 cursor-pointer flex-1 text-right';
    const icon = document.createElement('i');
    icon.className = 'fas fa-trash-alt';
    removeIconDiv.appendChild(icon);
    removeIconDiv.onclick = () => removeCourse(courseId);

    courseItem.appendChild(courseNameDiv);
    courseItem.appendChild(courseIdDiv);
    courseItem.appendChild(removeIconDiv);

    return courseItem;
}

function spawnCourseItems(courses) {
    const container = document.getElementById('coursesContainer');
    courses.forEach(course => {
        console.log(course);
        const courseItem = createCourseItem(course.title, course.id);
        container.appendChild(courseItem);
    });
}


$("#addCourseForm").submit(function(event) {
    event.preventDefault();
    const courseId = $("#courseIdInput").val();

    $.post("http://localhost:3000/addCourse", { id: courseId}, function(data) {
        console.log(data);
        window.location.reload();
    });
})

function removeCourse(courseId) {
    $.post("http://localhost:3000/removeCourse", { id: courseId}, function(data) {
        console.log(data);
        window.location.reload();
    });
}

getCourses();