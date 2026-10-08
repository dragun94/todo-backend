# 프로젝트 구조

할 일 기능의 코드를 `src/modules/todos`에 모으고, 역할별 파일로 분리했습니다.

```text
index.js                         서버 시작 및 종료
src/
  app.js                         Express 앱 구성
  config/env.js                  환경 변수 설정
  database/connection.js         MongoDB 연결
  middleware/error-handler.js    JSON 요청 오류 처리
  modules/todos/
    todo.routes.js               API 경로 연결
    todo.controller.js           요청 검증 및 응답 처리
    todo.model.js                컬렉션 스키마와 문서 생성
    todo.repository.js           컬렉션 초기화 및 DB 저장
scripts/
  init-db.js                     DB 초기화 실행
```

새 기능은 `src/modules/기능이름` 폴더에 같은 방식으로 추가합니다. `npm start`, `npm run dev`, `POST /todos`의 사용 방법은 동일합니다.

# 할 일 데이터베이스

MongoDB의 `todos` 컬렉션에 할 일을 저장합니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `_id` | ObjectId | MongoDB가 자동으로 생성하는 고유 ID |
| `title` | string | 할 일 내용, 공백만 있는 내용 제외, 최대 500자 |
| `completed` | boolean | 완료 여부 |
| `createdAt` | Date | 생성 시간 |
| `updatedAt` | Date | 마지막 수정 시간 |

`.env`에 `MONGO_URI`를 설정한 후 `node scripts/init-db.js`를 실행하면 컬렉션과 최신순 조회용 인덱스를 생성합니다. `npm start`로 서버를 실행할 때도 초기화합니다. 반복 실행할 수 있으며 기존 문서는 삭제하지 않습니다. 기존 컬렉션에는 검증 규칙을 적용합니다. 기존 문서를 자동 보정하지 않으므로 이후 수정 시 필수 필드를 갖춰야 합니다.

저장 코드 예시:

```js
const { createTodoDocument } = require('./src/modules/todos/todo.model');
const result = await app.locals.todos.insertOne(createTodoDocument('장보기'));
```

`createTodoDocument`는 완료 여부를 `false`로 설정하고 생성·수정 시간을 채웁니다. MongoDB 자체는 이 기본값을 자동으로 채우지 않습니다. 할 일을 수정할 때는 `updatedAt`도 `new Date()`로 갱신해야 합니다.

## 할 일 생성 API

서버 실행: `npm start`

`POST http://localhost:5000/todos`

요청 헤더: `Content-Type: application/json`

요청 본문:

```json
{ "title": "장보기" }
```

성공 시 `201 Created`와 저장된 할 일을 반환합니다.

```json
{
  "title": "장보기",
  "completed": false,
  "createdAt": "2026-10-08T00:00:00.000Z",
  "updatedAt": "2026-10-08T00:00:00.000Z",
  "_id": "507f1f77bcf86cd799439011"
}
```

앞뒤 공백을 제거한 제목이 1~500자인 경우 저장합니다. 제목 누락, 공백만 있는 제목, 문자열이 아닌 제목, 길이 초과 또는 잘못된 JSON에는 `400`을 반환합니다. 저장 실패에는 `500`을 반환합니다. 오류 응답 형식은 `{ "error": "오류 메시지" }`입니다. 완료 여부와 날짜는 서버에서 설정합니다.


## 프런트엔드 연결과 전체 API

`../todo-firebase/index.html` 화면은 `todo-db.js`를 통해 `http://localhost:5000/todos`로 요청합니다. 백엔드에서 `npm start`를 실행한 후 화면을 열면 됩니다. 로컬 정적 서버와 파일 직접 열기를 위한 CORS 처리를 제공합니다.

| 작업 | 메서드 | 경로 | 성공 응답 |
| --- | --- | --- | --- |
| 목록 조회 | GET | `/todos` | 200, 할 일 배열 |
| 개별 조회 | GET | `/todos/:id` | 200, 할 일 객체 |
| 추가 | POST | `/todos` | 201, 생성된 할 일 |
| 내용·완료 수정 | PATCH | `/todos/:id` | 200, 수정된 할 일 |
| 삭제 | DELETE | `/todos/:id` | 204, 본문 없음 |

수정 본문은 `{ "title": "수정 내용" }`, `{ "completed": true }` 또는 두 필드를 함께 보낼 수 있습니다. 수정 시 `updatedAt`도 갱신합니다. 잘못된 ID·입력은 400, 없는 할 일은 404, DB 오류는 500입니다. 목록은 최신 생성순으로 반환합니다. 기존 Supabase 및 localStorage 데이터는 자동 이전하지 않습니다.

## 브라우저에서 화면 열기

`node index.js` 또는 `npm start`로 실행한 후 `http://localhost:5000`을 열면 `../todo-firebase/index.html` 화면이 표시됩니다. 화면의 CSS와 JavaScript도 같은 서버에서 제공합니다. `/todos`는 기존 할 일 API입니다. 코드 변경 후에는 실행 중인 서버를 종료하고 다시 실행하세요.
