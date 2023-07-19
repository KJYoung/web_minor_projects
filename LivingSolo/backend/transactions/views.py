import json
from json.decoder import JSONDecodeError

from django.views.decorators.http import require_http_methods
from django.http import HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from transactions.models import Transaction, TransactionType, TransactionTypeClass


@require_http_methods(['GET', 'POST'])
def general_transaction(request):
    """
    GET : get element list
    POST : create element
    """
    if request.method == 'GET':
        # Params: combined<Boolean?>, keyword<String?>, year<Number?(Number if month is valid)>, month<Number?>

        query_args = {}
        query_args["combined"] = bool(request.GET.get("combined", False))
        query_args["keyword"] = request.GET.get("keyword", None)
        query_args["year"] = request.GET.get("year", None)
        query_args["month"] = request.GET.get("month", None)

        searched_trxn = Transaction.objects.all()
        # Filtering
        # 1. Filter by Year & Month
        if query_args["year"] and query_args["month"]:
            # 1-1. Both Year & Month
            searched_trxn = searched_trxn.filter(
                date__year=query_args["year"], date__month=query_args["month"]
            )
        elif query_args["year"]:
            # 1-2. Only Year
            searched_trxn = searched_trxn.filter(date__year=query_args["year"])

        # 2. Filter by Keyword
        if query_args["keyword"]:
            searched_trxn = searched_trxn.filter(memo__icontains=query_args["keyword"])
        result = []
        for tr_elem in searched_trxn:

            # print(tr_elem.date)
            # print(type(tr_elem.date))
            types = []
            for type_elem in list(tr_elem.type.all().values()):
                types.append(
                    {
                        "id": type_elem['id'],
                        "name": type_elem['name'],
                        "color": type_elem['color'],
                    }
                )
            result.append(
                {
                    "id": tr_elem.id,
                    "memo": tr_elem.memo,
                    "date": tr_elem.date,
                    "type": types,
                    "period": tr_elem.period,
                    "amount": tr_elem.amount,
                }
            )
        return JsonResponse({"elements": result}, safe=False)
    else:  ## post
        try:
            req_data = json.loads(request.body.decode())
            element = Transaction(
                memo=req_data["memo"],
                amount=req_data["amount"],
                period=req_data["period"],
                date=req_data["date"],
            )
            element.save()

            # Set Types
            type_bubble_list = req_data["type"]
            for type_bubble in type_bubble_list:
                type_elem = TransactionType.objects.get(pk=type_bubble["id"])
                element.type.add(type_elem)
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        return JsonResponse({"id": element.id, "memo": element.memo}, status=201)


@require_http_methods(['PUT', 'DELETE'])
def detail_transaction(request, trxn_id):
    """
    PUT : edit element's content
    DELETE : delete element
    """
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode())
            trxn_id = int(trxn_id)
            trxn_obj = Transaction.objects.get(pk=trxn_id)

            trxn_obj.memo = data["memo"]
            trxn_obj.amount = data["amount"]
            trxn_obj.save()
            return JsonResponse({"message": "success"}, status=200)
        except Transaction.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()
    else:  ## delete
        try:
            trxn_id = int(trxn_id)
            trxn_obj = Transaction.objects.get(pk=trxn_id)

            trxn_obj.delete()
            return JsonResponse({"message": "success"}, status=200)
        except Transaction.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()


## Transaction Type Class
@require_http_methods(['GET'])
def general_trxn_type_class(request):
    """
    GET : get trxn type class list
    """
    if request.method == 'GET':
        try:
            result = []
            for trc_elem in TransactionTypeClass.objects.all():
                types_list = []
                for types in list(trc_elem.type.all().values()):
                    # print(types)
                    # {'id': 1, 'created': datetime.datetime(2023, 7, 12, 22, 43, 56, 23036), 'updated': datetime.datetime(2023, 7, 12, 22, 43, 56, 27034), 'name': '클1타1', 'color': '#000000', 'type_class_id': 1}
                    types_list.append(
                        {"id": types['id'], "name": types['name'], "color": types['color']}
                    )
                result.append(
                    {
                        "id": trc_elem.id,
                        "name": trc_elem.name,
                        "color": trc_elem.color,
                        "types": types_list,
                    }
                )
            return JsonResponse({"elements": result}, safe=False)
        except (TransactionTypeClass.DoesNotExist):
            print("ERROR from general_trxn_type_class")
            return HttpResponseBadRequest()


## Transaction Type
@require_http_methods(['GET'])
def general_trxn_type(request):
    """
    GET : get trxn type list
    """
    if request.method == 'GET':
        try:
            result = []
            for tr_elem in TransactionType.objects.all():
                class_elem = (
                    tr_elem.type_class
                )  # tr_elem.type_class(FK field) : TrxnTypeClass Object
                result.append(
                    {
                        "id": tr_elem.id,
                        "name": tr_elem.name,
                        "color": tr_elem.color,
                        "type_class": {
                            "id": class_elem.id,
                            "name": class_elem.name,
                            "color": class_elem.color,
                        },
                    }
                )
            return JsonResponse({"elements": result}, safe=False)
        except (KeyError, JSONDecodeError, TransactionTypeClass.DoesNotExist):
            print("ERROR from general_trxn_type")
            return HttpResponseBadRequest()
