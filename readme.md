# Exercise 5.2 – Getting Started with Istio Service Mesh

## Objective
The goal of this exercise is to install Istio service mesh into a Kubernetes cluster and deploy the official Bookinfo sample application to observe service-to-service communication managed by Istio.

---

## Environment
- Local cluster: k3d
- Kubernetes: k3s (via k3d)
- Service Mesh: Istio
- Mode: Sidecar injection (demo profile)
- OS: macOS

---

## Steps Performed

### 1. Install Istio CLI
```bash
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH
```

### 2. Install Istio (demo profile)
```bash
istioctl install --set profile=demo -y
```

### 3. Deploy Bookinfo sample app
```bash
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```

### 4. Enable automatic sidecar injection
```bash
kubectl label namespace default istio-injection=enabled
kubectl delete pods --all
```

### 5. Verify pods
```bash
kubectl get pods
```

All pods show:

```
2/2 Running
```

Meaning:
- 1 application container
- 1 istio-proxy sidecar

This confirms the service mesh is active.

### 6. Access application
```bash
kubectl port-forward svc/productpage 9080:9080
```

Open:
```
http://localhost:9080/productpage
```

---

## Result
The Bookinfo web application loads successfully.
Traffic between services is handled automatically by Istio sidecar proxies.

Features verified:
- Service mesh installed
- Sidecar injection working
- Inter-service communication functional
- Application accessible via port-forward

---

## Proof Screenshot
See:

![Proof Screenshot](images/ex5.2.jpeg)

The screenshot shows:
- Running pods with `2/2`
- Port-forward command
- Bookinfo webpage loaded in browser

---

## Cleanup
```bash
kubectl delete -f samples/bookinfo/platform/kube/bookinfo.yaml
istioctl uninstall -y
kubectl delete namespace istio-system
```

---

## Conclusion
Istio successfully provides:
- Traffic management
- Observability
- Automatic sidecar proxies
- Simplified microservice communication

The service mesh was deployed and verified successfully.
