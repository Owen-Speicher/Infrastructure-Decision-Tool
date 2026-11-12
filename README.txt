Infrastructure Decision Tool
INFO 300

This program has two tools:
1. Subnet Host Checker
2. Compute Environment Selector

The Subnet Host Checker checks if a subnet can handle the number of devices that are entered.
AWS also reserves 5 IP addresses per subnet.

The Compute Environment Selector recommends an AWS input based on the number of monthly users,
budget, and availability.

Sufficient Subnet
VPC CIDR: /16
Subnet CIDR: /24
Devices: 200
Usable IPs: 251
Unused IPs: 51
Result: Sufficient


Insufficient Subnet
VPC CIDR: /16
Subnet CIDR: /24
Devices: 300
Usable IPs: 251
Additional IPs needed: 49
Result: Not sufficient