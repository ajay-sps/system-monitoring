import psutil

def get_process_details():
    process_list = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'create_time', 'username']):
        try:
            process_list.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": proc.info['cpu_percent'],
                "memory_percent": proc.info['memory_percent'],
                "start_time": proc.info['create_time'],
                "user": proc.info['username'],
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return process_list