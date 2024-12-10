from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import get_process_details
import psutil
from rest_framework import status


class ProcessListAPIView(APIView):
    def get(self, request):
        process_list = get_process_details()
        return Response({"processes": process_list})
    

class ProcessTerminateAPIView(APIView):
    def post(self, request, pid):
        try:
            proc = psutil.Process(pid)
            proc.terminate()
            proc.wait() 
            return Response({"message": f"Process {pid} terminated successfully."}, status=status.HTTP_200_OK)
        except psutil.NoSuchProcess:
            return Response({"error": "Process not found."}, status=status.HTTP_404_NOT_FOUND)
        except psutil.AccessDenied:
            return Response({"error": "Permission denied to terminate the process."}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class SystemSummaryAPIView(APIView):
    def get(self, request):
        total_cpu = psutil.cpu_percent(interval=1)
        total_memory = psutil.virtual_memory().percent
        return Response({
            "total_cpu_usage": total_cpu,
            "total_memory_usage": total_memory,
        })
