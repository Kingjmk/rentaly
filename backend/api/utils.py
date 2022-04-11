
from rest_framework import pagination


class Paginator(pagination.PageNumberPagination):
    page_size_query_param = 'page_limit'
    max_page_size = 100

    def get_next_link(self):
        if not self.page.has_next():
            return None
        return self.page.next_page_number()

    def get_previous_link(self):
        if not self.page.has_previous():
            return None
        return self.page.previous_page_number()
