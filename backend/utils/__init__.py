
def generate_error_response(error):
    if isinstance(error, list):
        return {'non_field_errors': error}
    return {'non_field_errors': [error]}
