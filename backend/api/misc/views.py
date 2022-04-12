from rest_framework import generics, response
from .. import permissions
import services.geocode


class GeocodeLocateView(generics.GenericAPIView):
    permission_classes = [permissions.AdminPermission | permissions.RealtorPermission | permissions.ClientPermission]

    def get(self, request, *args, **kwargs):
        address = self.request.GET.get('address')
        res = services.geocode.locate(address)

        return response.Response(res.json(), status=res.status_code)
