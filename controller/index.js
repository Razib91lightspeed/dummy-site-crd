const k8s = require('@kubernetes/client-node');
const axios = require('axios');

const kc = new k8s.KubeConfig();
kc.loadFromCluster();

const watch = new k8s.Watch(kc);
const coreApi = kc.makeApiClient(k8s.CoreV1Api);

watch.watch(
  '/apis/stable.dwk/v1/dummysites',
  {},
  async (type, obj) => {
    if (type !== 'ADDED') return;

    const name = obj.metadata.name;
    const ns = obj.metadata.namespace;
    const url = obj.spec.website_url;

    console.log("Fetching:", url);

    const res = await axios.get(url);

    await coreApi.createNamespacedConfigMap(ns, {
      metadata: { name: `${name}-html` },
      data: { "index.html": res.data }
    });

    await coreApi.createNamespacedPod(ns, {
      metadata: { name: `${name}-pod` },
      spec: {
        containers: [{
          name: "nginx",
          image: "nginx",
          volumeMounts: [{
            name: "html",
            mountPath: "/usr/share/nginx/html"
          }]
        }],
        volumes: [{
          name: "html",
          configMap: { name: `${name}-html` }
        }]
      }
    });

    console.log("Site deployed:", name);
  }
);
