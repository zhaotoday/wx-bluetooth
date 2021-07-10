# wx-bluetooth

```
$ npm install wx-bluetooth
```

```js
import { useBluetooth } from 'wx-bluetooth/composables/use-bluetooth';

const { on, off, openAdapter } = useBluetooth({ emits: ['adapter-state-change'] })
// ...
```
