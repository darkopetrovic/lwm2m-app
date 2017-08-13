# Redux store

## Device

```js
{
  devices: {
    list: {},
    active: {
      infos: {
        id: 323,
        type: 'Device type',
        name: 'Device name',
        binding: 'U',
        lifetime: '60000',
        path: '/rd',
        port: 53886,
        address: '2001::100',
        creationDate: '2017-08-03T22:27:18.321Z'
      },
      objects_id: [1,3,3301, ...],
      objects: [
        {
          id: 1,
          shortname: 'lwm2mServer',
          instance_id: 0
        },
        {
          id: 3,
          shortname: 'device',
          instance_id: 0
        },
        {
          id: 3301,
          shortname: 'illuminance',
          instance_id: 0
        }
      ]
      resources: {
        '330105604': {
          _id: '58a1f7c6823895b4fb79e21f',
          units: '',
          range: null,
          type: 'Float',
          mandatory: false,
          multiple: false,
          access: 'R',
          description: '',
          name: '',
          shortname: 'maxRangeValue',
          id: '5604',
          __v: 0,
          specific_object: null,
          value: null,
          instance_id: 0,
          object_id: 3301
        },
        '330105700': {
          _id: '58a1f7c6823895b4fb79e222',
          units: '',
          range: null,
          type: 'Float',
          mandatory: true,
          multiple: false,
          access: 'R',
          description: '',
          name: '',
          shortname: 'sensorValue',
          id: '5700',
          __v: 0,
          specific_object: null,
          value: null,
          instance_id: 0,
          object_id: 3301
        },
      res_values: {
        '331505701': {
          value: null,
          isFetching: false
        }
      }
    },
    device: null
  },
```