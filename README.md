# wx-bluetooth
```
$ npm install wx-bluetooth
```

```js
import { useBluetooth } from 'wx-bluetooth/composables/use-bluetooth';

const { on, off, tryOpenAdpeter } = useBluetooth({ emits: ['adpter-state-change'] })
// ...
```
