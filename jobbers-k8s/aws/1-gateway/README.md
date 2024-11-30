### generate the cert files

```bash
# input your password for these 3 option
Enter PEM pass phrase:
Verifying - Enter PEM pass phrase:
Enter pass phrase for domain.key:
...
# this needs to match the hostname
Common Name (e.g. server FQDN or YOUR name) []:jobberapp.cc
...
```

### Create the tls secrets

```bash
$ kubectl -n production create secret tls gateway-ingress-tls --key jobberapp.cc.key --cert jobberapp.cc.crt

secret/gateway-ingress-tls created
```

### minikube addons configure ingress

```bash
$ minikube addons configure ingress
-- Enter custom cert (format is "namespace/secret"): production/gateway-ingress-tls
✅  ingress was successfully configured
```

### effect the ingress configuration

```bash
$ minikube addons disable ingress
🌑  The 'ingress' addon is disabled

$ minikube addons enable ingress
💡  ingress is an addon maintained by Kubernetes. For any concerns contact minikube on GitHub.
You can view the list of minikube maintainers at: https://github.com/kubernetes/minikube/blob/master/OWNERS
💡  After the addon is enabled, please run "minikube tunnel" and your ingress resources would be available at "127.0.0.1"
    ▪ Using image registry.k8s.io/ingress-nginx/controller:v1.11.2
    ▪ Using image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.4.3
    ▪ Using image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.4.3
🔎  Verifying ingress addon...
🌟  The 'ingress' addon is enabled
```
