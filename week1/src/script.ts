// 1. HTML 요소 선택 (핸드북 자바스크립트 편 참고)
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

// 2. 할 일이 어떻게 생긴애인지 Type을 정의
type Todo = {
    id: number;
    text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// - 할 일 목록 렌더링 하는 함수를 정의
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) : void => { // 추가된 목록 출력
        const li = createTodoElement(todo, false);
        todoList.appendChild(li); // 리스트 밀어 넣기 
    });

    doneTasks.forEach((todo) : void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

// 3. 할 일 텍스트 입력 처리 함수 
const getTodoText = (): string => {
    return todoInput.value.trim(); // 공백 제거해 받아 오기
}; 

// 4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text});
    todoInput.value = ''; // 입력칸 초기화
    renderTasks(); // 입력 후 렌더링 
}

// 5. 할 일 상태 변경 (완료로 이동)
const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t) : boolean => t.id !== todo.id); // 클릭한 것 빼고 다 보여줌(필터링해서)

    doneTasks.push(todo)
    renderTasks();
}

// 6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t) : boolean => t.id !== todo.id);
    renderTasks();
}

// 7. 할 일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 선정)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => { 
    const li = document.createElement('li'); // 리스트 생성
    li.classList.add('render-container__item'); // 클래스 넣기
    li.textContent = todo.text; // 입력한 값 넣기 

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', () : void => {
        if (isDone) {
        deleteTodo(todo);
        } else {
        completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;  // node 타입은 무조건 반환해야 함.
};

// 8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event) : void => {
    event.preventDefault();  // 버튼 누를 때마다 (form data 전송) 새로고침(값 초기화) 방지
    const text = getTodoText(); // 공백제거된 텍스트 가져오기기

    if (text) {
        addTodo(text);
    }
});

renderTasks(); // 처음엔 항상 실행을 시켜주자. 