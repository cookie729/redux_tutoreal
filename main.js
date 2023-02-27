const defaultState = { counter: 0 };
// デフォルトの状態を表示するには、レンダリングする必要
// デフォルトの状態をhtmlにレンダリング

const content = document.getElementById('content');

const render = () => {
  content.innerHTML = defaultState.counter;
};
render();

// redux と redux-actions は windows.Redux と window.ReduxActions というグローバル変数で見つける事ができる
// defaultState を保存するための store が必要
// redux からは createStore を使って作れる

const { createStore } = window.Redux

// 最初のアクションを処理
const { createAction, handleAction } = window.ReduxActions;

// createActionで最初のアクション 'increment' を作成
const increment = createAction('INCREMENT')

// handleAction で createAction で作成した 'INCREMENT' を処理する
// どのアクションを処理するべきか分かる為に　increment action 状態の返還を処理するメソッド、そしてデフォルトの状態を提供する事ができる
const reducer = handleAction(
  increment,
  (state, action) => ({
    ...state,
    counter: state.counter + 1
  })
  defaultState
)

// handleAction は redux store の為の reducer を生成した
// これで reducer が出来た為、store を生成できる

const store = createStore(reducer, defaultState)

// store が出来たので、renderメソッドを書き換えて、defaultState の代わりに store を使用することができる。
// また、store の変更に対して render を subscribe(サブスクライブ)する事ができる
// サブスクライブ：署名する、寄付する、登録する、同意する

const render = () => {
  content.innerHTML = store.getState().counter;
}

store.subscribe(render)

// これで action を dispatch する準備が出来た
// incrementボタンがクリックされたときに、increment action creator に dispatch する為の event listener を作成する

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(increment())
})

// INCREMENTボタンをクリックするたびに 1 ずつ上がっていく

// DECREMENTボタンの作成

// decrement で 最初の2つ目のアクション 'DECREMENT' を作成
const decrement = createAction('DECREMENT')

// increment で使ったような handleAction を使う代わりに、他のツールである handleActions に置き換えることで、increment と　decrement の両方のアクションを処理する事ができるようになる
const { createAction, handleActions } = window.ReduxActions;
const reducer = handleActions(
  {
    [increment]: (state) => ([ ...state, counter: state.counter + 1 ]),
    [decrement]: (state) => ([ ...state, counter: state.counter - 1 ])
  },
  defaultState
)

// decrement action を dispatch するハンドラを追加すると、increment と decrement の両方のボタンが適切に機能する
document.getElementById('decrement').addEventListener('click', () => {
  store.dispatch(decrement())
})

// redux-actionsにはまだ利用してない他のツールがある。
// 残りのツールを使う為にコードを変更する

// increment と decrement の両方の actionCreator の宣言を createAction を使用する事から、createActionsを使用することに変更できる

// increment と decrement の両方の actionCreator 宣言がある。
// これらの行を createAction を使用する事から、createActions を使用する事に変更できる

const { createActions, handleActions } = window.ReduxActions
const { increment, decrement } = createActions('INCREMENT', 'DECREMENT')

// 更に良い方法は、'INCREMENT_FIVE'のようなアクションが欲しい場合は、既存のアクションのバリエーションを簡単に作成できるようにしたい
// reducer のロジックをアクションに抽象化することで、既存のアクションの新しい組み合わせを簡単に作成する事ができる。

const { increment, decrement } = createActions({
  INCREMENT: (amount = 1) => ({ amount }),
  DECREMENT: (amount = 1) => ({ amount: -amount })
})

const reducer = handleActions(
  {
    [increment]: (state, { payload: { amount } }) => {
      return { ...state, counter: state.counter + amount };
    },
    [decrement]: ( state, { payload: { amount } }) => {
      return { ...state, counter: state.counter + amount };
    }
  },
  defaultState
)

// ロジックを移動したことで、reducer の見た目は同じになったが、これをどうにかして組み合わせる事ができればいい　→
// そこでcombineActions を使って、複数の異なるアクションを同じ reducer で削減する事ができる

const { createActions, handleActions, combineActions } = window.ReduxActions

const reducer = handleActions(
  {
    [combineActions(increment, decrement)]: (
      state,
      { payload : { amount }}
    ) => {
      return { state, counter: state.counter + amount }
    }
  },
  defaultState
)

// これで redux-actions が提供する全てのツールを使った。
// 