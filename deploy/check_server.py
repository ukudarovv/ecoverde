import paramiko
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(
    "213.155.21.70",
    username="ubuntu",
    password="eKn1YnBZd5xVE3z4/IuXyv0=",
    timeout=30,
    banner_timeout=60,
    look_for_keys=False,
    allow_agent=False,
)

checks = [
    "ps aux | head -1; ps aux | grep setup.sh | grep -v grep",
    "systemctl is-active ecoverde-backend nginx ecoverde-telegram 2>&1",
    "test -f /opt/ecoverde/frontend/dist/index.html && echo dist_ok || echo dist_missing",
    "curl -sI --max-time 8 https://ecoverde.kz 2>&1 | head -5",
]

for cmd in checks:
    print("---", cmd)
    _, stdout, _ = ssh.exec_command(cmd, timeout=20)
    print(stdout.read().decode("utf-8", "replace"))

ssh.close()
