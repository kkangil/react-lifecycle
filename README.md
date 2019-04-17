This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 주요 라이프사이클

### componentDidMount
- 렌더가 된 이후 실행되는 라이프사이클로 최초 API 요청 사용에 적합한 라이프 사이클

### shouldComponentUpdate
- component 의 상태값이 변경되었을때 render 직전에 호출되는 라이프 사이클
- Boolean 값을 return 해야하며, false 를 return 하면 렌더를 하지 않음.
- 렌더를 하지 않으므로 이후 라이프사이클도 먹히지 않음.

### componentWillUnmount
- component가 DOM 에서 삭제(해당 컴포넌트 미표시)할때 마지막으로 실행되는 메소드
- interval 이나 비동기 API 제거에 주로 쓰임.

## 16.3 이후 변경된 라이프사이클
- 렌더링 제어에 많은 방법이 있기때문에 라이프사이클 사용에 혼란이 생김.
- 실제 커뮤니티에서도 어떤 라이프사이클이 좋다 안좋다 성능 이슈가 많음. 대표적으로 componentWillMount 와 componentDidMount 둘중 어떤 라이프사이클에서 API를 호출해야하는지.
- 향후 componentWillMount, componentWillReceiveProps, componentWillUpdate 라이프사이클이 삭제되고 `UNSAFE_` 라이프사이클만 동작할것이라고 예고
- 이를 대체하기 위해 새로운 라이프사이클 추가

### 라이프사이클 동작 순서
- 최초 진입: `constructor` -> `getDerivedStateFromProps` -> `render` -> `componentDidMount` 순으로 실행.
- props 변경: `getDerivedStateFromProps` -> `shouldComponentUpdate` -> `render` -> `getSnapshotBeforeUpdate` -> `componentDidUpdate` 순으로 실행
- state 변경: `shouldComponentUpdate` -> `render` -> `getSnapshotBeforeUpdate` -> `componentDidUpdate` 순으로 실행

### getDerivedStateFromProps
- componentDidMount 보다 먼저 실행
- window 객체 접근 가능(storage 사용 가능)
- props 와 state가 변경되었을때는 최초 실행
- 파리미터로 변경될 props 와 state가 넘어옴. this.state 접근 불가능
- return 되는 객체값으로 state 가 변경된다. (해당 라이프사이클에서는 state 변경만 해주는것이 바람직하다고 판단됨.) state를 변경해주고 싶지 않을때에는 null 을 return 해주면된다.
- 최초 페이지 진입시 `componentDidMount` 라이프사이클에서 fetch 실행
- react 공식문서에서는 props 가 변경되었을때 fetch가 필요하다면 해당 라이프사이클에서 API(data fetching) 요청 하는것이 아닌 `componentDidUpdate` 라이프 사이클에서 fetch 하도록 유도하고 있음.

### getSnapshotBeforeUpdate
- `componentWillUpdate` 의 대체 라이프사이클
- DOM이 업데이트 되기 직전이 실행
- `componentDidUpdate` 전에 실행되며 해당 라이프사이클의 return 값이 componentDidUpdate 3번째 파라미터로 전달됨.
- 기존 `componentWillUpdate` 와 같이 해당 라이프사이클 안에서 this.setState()를 사용하는 경우 무한루프에 빠지게 됨.
- 자주 사용되지는 않을것으로 판단됨.

## Error Boundary
- 렌더 과정에서 에러가 생겼을경우 앱이 죽는것이 아니라 UI 변경과 같은 대안으로 앱이 죽지 않도록 하는 방식
- 해당 class를 최상단에 두고 라이프사이클을 이용해서 조작할 수 있다.

### getDerivedStateFromError
- 16.6 버전에 추가된 라이프 사이클
- 해당 라이프 사이클은 렌더 중에 호출되며 fallback UI를 렌더링 하기 위한 메소드이다.
- 렌더 중에 호출되기 때문에 side effect(API call, 함수 호출) 을 사용하지 않는것이 좋다.
- react 공식 문서에서는 componentDidCatch 라이프 사이클을 추천한다.
- return 객체는 state 가 해당 객체로 변경된다.

### componentDidCatch
- 해당 라이프사이클은 에러를 기록하거나 트래킹하기 위한 작업을 위해 주로 사용된다. (ex Sentry)
- 해당 라이프 사이클에서도 state 를 변경하여 UI 를 변경해줄수 있지만 추천되지 않는다.