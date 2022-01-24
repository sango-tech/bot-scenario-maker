## Bot Flows Maker

## Development

```
$ yarn
$ yarn watch
$ yarn build
```

## Dev page
```
cd cdn && yarn && yarn start
```

## Usage

```js

const container = document.body;
const chatbotFlow = Sango.ChatBotFlowsMaker(container);
chatbotFlow.setCardTypes([
  {
    name: 'question',
    displayText: 'Question',
  },
  {
    name: 'message',
    displayText: 'Message',
  },
  {
    name: 'goal',
    displayText: 'Goal',
  },
])

chatbotFlow.addCard({
  id: '1',
  uniqueId: '1',
  title: 'Question #1',
  titleBadge: 'QA',
  left: 100,
  top: 100,
  answers: [
    {
      id: '1',
      title: 'YES',
      nextCards: [
        {
          nodeIndex: 7,
          uniqueId: '2'
        },
      ]
    },
    {
      id: '2',
      title: 'NO',
    },
  ]
})

chatbotFlow.addCard({
  id: '2',
  uniqueId: '2',
  title: 'Question #2',
  titleBadge: 'QA',
  left: 400,
  top: 200,
  answers: [
    {
      id: '3',
      title: 'YES',
    },
    {
      id: '4',
      title: 'NO',
    },
  ]
})

chatbotFlow.onCardEdit((uniqueId) => {
  console.log('Card edit clicked', uniqueId)
  // After update card
  // chatbotFlow.updateCard(uniqueId, {answers: []}).reRender();
})

chatbotFlow.onChange((newValue) => {
  console.log('New data', newValue)
})

chatbotFlow.onAddNextClicked((data) => {
  console.log('Card add next clicked', data)
})

chatbotFlow.render();

```
