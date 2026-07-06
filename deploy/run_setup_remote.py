import paramiko
import sys
import time

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

cmd = (
    "cd /opt/ecoverde && git pull --ff-only && "
    "nohup bash deploy/setup.sh > /tmp/ecoverde-setup.log 2>&1 & echo STARTED"
)
_, stdout, _ = ssh.exec_command(cmd, timeout=20)
print(stdout.read().decode("utf-8", "replace"))
ssh.close()

print("Waiting for setup...")
for i in range(24):
    time.sleep(15)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(
        "213.155.21.70",
        username="ubuntu",
        password="eKn1YnBZd5xVE3z4/IuXyv0=",
        timeout=20,
        banner_timeout=40,
        look_for_keys=False,
        allow_agent=False,
    )
    _, stdout, _ = ssh.exec_command(
        "tail -5 /tmp/ecoverde-setup.log 2>/dev/null; "
        "systemctl is-active ecoverde-backend nginx 2>&1; "
        "test -f /opt/ecoverde/frontend/dist/index.html && echo dist_ok || echo dist_missing",
        timeout=15,
    )
    out = stdout.read().decode("utf-8", "replace")
    print(f"--- check {i+1} ---")
    print(out)
    ssh.close()
    if "dist_ok" in out and "active" in out.splitlines()[0] if out else False:
        break
    if "Done." in out or "Deploy complete" in out:
        break
