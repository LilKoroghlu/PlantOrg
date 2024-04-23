// import jwt_decode from 'jwt-decode';

(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

})(jQuery);


$('.loginedUserName').text('Hörmətli, ' + localStorage.getItem('UserName') + ' ' + localStorage.getItem('UserSurname'))
$('.adminImg').attr('src', '/Admin/images/' + localStorage.getItem('UserProfilePhotoUrl'));




$(document).ready(function () {

	//User
	$("#user_li").click(() => {
		$.ajax({
			url: 'https://localhost:7090/api/admin/getUser', // Controller metodunun rotasını doğru şekilde belirtin
			type: 'GET',
			contentType: 'application/json',
			dataType: 'json',
			success: function (x) {

				$('#content').html("");
				$('#content').css('display', 'flex')

				var table = $('<table>').addClass('table table-bordered tableMeasure');
				var thead = $('<thead>');
				var tr = $('<tr>');
				var button = $('<button class="btn mb-5" type="button" data-bs-toggle="modal" style="background-color:#4eac6d; color:white" data-bs-target="#addModal" id="addButton" class="btn btn-primary mb-5 ">Add</button>');
				tr.append('<th>' + "Sıra" + '</th>')
				Object.keys(x[0]).forEach(function (key) {
					tr.append('<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>');
				})

				tr.append('<th>Edit</th>');
				tr.append('<th>Delete</th>');

				thead.append(tr);
				table.append(thead);

				var tbody = $('<tbody>');
				$('tbody').empty();
				$.each(x, function (index, item) {
					var tr = $('<tr>');
					tr.append('<td>' + (index + 1) + '</td>');
					tr.append('<td style="display: none;">' + item.id + '</td>');
					Object.keys(item).forEach(function (key) {
						if (key !== 'id') {
							tr.append('<td>' + item[key] + '</td>');
						}
					});

					tr.append('<td><i class="fas fa-edit edit-icon-user" data-bs-toggle="modal" data-bs-target="#updateModal"></i></td>');
					tr.append('<td><i class="fas fa-trash-alt delete-icon"></i></td>');

					tbody.append(tr);
				});

				table.append(tbody);

				table.find('thead th:contains("Id")').hide();

				var modalUpdate = $('<div class="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label for="exampleInputEmail1">Name</label>\
								  <input  class="form-control" id="Name" aria-describedby="emailHelp">\
								  <small id="emailHelp" class="form-text text-muted"></small>\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">Surname</label>\
								  <input  class="form-control" id="Surname">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">Email</label>\
								  <input  class="form-control" id="Email">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">Password</label>\
								  <input  class="form-control" id="Password">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">Phone</label>\
								  <input  class="form-control" id="Phone">\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="saveUPD" class="btn" style="background-color:#4eac6d;color:white">Save changes</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var modalAdd = $('<div class="modal fade" id="addModal" tabindex="-1" role="dialog"> \
				<div class="modal-dialog" role="document"> \
					<div class="modal-content"> \
						<div class="modal-header"> \
							<h1 class="modal-title fs-5">Modal title</h1> \
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
						</div> \
						<div class="modal-body"> \
						<form>\
						<div class="form-group">\
						  <label>Name</label>\
						  <input class="form-control" id="addName">\
						  <small id="emailHelp" class="form-text text-muted"></small>\
						</div>\
						<div class="form-group">\
						  <label>Surname</label>\
						  <input  class="form-control" id="addSurname">\
						</div>\
						<div class="form-group">\
						  <label>Email</label>\
						  <input  class="form-control" id="addEmail">\
						</div>\
						<div class="form-group">\
						  <label>Password</label>\
						  <input  class="form-control" id="addPassword">\
						</div>\
						<div class="form-group">\
						  <label>Statuse</label>\
						  <select id="statSelect" name="UserStatusId" style="display:block">\
							<option value="1">Admin</option>\
							<option value="2">Operator</option>\
							<option value="3">Client</option>\
						  </select>\
						</div>\
						<div class="form-group">\
						  <label>Phone</label>\
						  <input  class="form-control" id="addPhone">\
						</div>\
						<div class="form-group">\
						  <label>Country</label>\
						  <select id="countrySelect" name="UserCountryId" style="display:block">\
						  </select>\
						</div>\
						<div class="form-group" id="citySelectDiv"  style="display:none">\
						  <label>City</label>\
						  <select id="citySelect" name="UserCityId" style="display:block">\
						  </select>\
						</div>\
						<div class="form-group">\
                         <label>Photo</label>\
                         <input type="file" class="form-control" id="addPhoto" accept="image/*">\
                         </div>\
					  </form>\
						</div> \
						<div class="modal-footer"> \
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
							<button type="button" id="saveADD" class="btn" style="background-color:#4eac6d;color:white">Add</button> \
						</div> \
					</div> \
				</div> \
			</div>')

				var alertModal = $('<div class="modal fade" id="alertModal" tabindex="-1" role="dialog"> \
				<div class="modal-dialog" role="document"> \
					<div class="modal-content"> \
						<div class="modal-header"> \
							<h1 class="modal-title fs-5">Modal title</h1> \
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
						</div> \
						<div class="modal-body"> \
						 <p>Are you sure want to delete this user?</p>\
						</div> \
						<div class="modal-footer"> \
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
							<button type="button" id="delete" class="btn" style="background-color:#4eac6d;color:white">Yes</button> \
						</div> \
					</div> \
				</div> \
			</div>')
				// Modalı sayfaya ekle
				$('body').append(modalUpdate);
				$('body').append(modalAdd)
				$('body').append(alertModal);

				// Modalı aç
				$('#updateModal').modal('hide');
				$('#addModal').modal('hide');
				$('#alertModal').modal('hide');
				$('#content').append(button);
				$('#content').append(table);


				$(document).ready(function () {
					$('.edit-icon-user').on('click', function () {
						var row = $(this).closest('tr');
						var userName = row.find('td:eq(2)').text();
						var userSurname = row.find('td:eq(3)').text();
						var userPassword = row.find('td:eq(4)').text();
						var userPhone = row.find('td:eq(6)').text();
						var userEmail = row.find('td:eq(7)').text();

						$('#Name').val(userName);
						$('#Surname').val(userSurname);
						$('#Password').val(userPassword);
						$('#Phone').val(userPhone);
						$('#Email').val(userEmail);


						$('#updateModal').modal('show');
						var id = row.find('td:eq(1)').text();

						$('#saveUPD').off('click').on('click', function () {
							console.log(id);
							let info = {
								"UserName": $('#Name').val(),
								"UserSurname": $('#Surname').val(),
								"UserEmail": $('#Email').val(),
								"UserPassword": $('#Password').val(),
								"UserPhone": $("#Phone").val()
							};
							$.ajax({
								url: 'https://localhost:7090/api/admin/updateUser/' + id,
								type: 'PUT',
								contentType: 'application/json',
								data: JSON.stringify(info),
								success: function (x) {
									alert("Updated");
								},
								error: function () {
									alert("Error updating");
								}
							});
						});
					});
				});

				$('#addButton').on('click', function () {
					$('#addModal').modal('show');

				})


				//Country doldurulması
				$.ajax({
					type: 'GET',
					url: 'https://localhost:7090/api/admin/getCountry',
					contentType: 'application/json',
					data: JSON.stringify(),
					success: function (data) {
						var select = $('#countrySelect')
						select.empty();
						for (var i = 0; i < data.length; i++) {
							select.append($('<option class="countryOPT">').text(data[i].countryName).val(data[i].countryId))
						}
					},
					error: function () {
						console.log("Error")
					}
				})

				$('#saveADD').on('click', function () {
					console.log($('#statSelect').val() + " " + $('#countrySelect').val());
				})


				$("#countrySelect").off('click').on('click', function () {
					var selectedCountryId = $(this).val();
					$('#citySelectDiv').css('display', 'block')

					$.ajax({
						type: 'GET',
						url: 'https://localhost:7090/api/admin/getCity/' + selectedCountryId,
						contentType: 'application/json',
						data: JSON.stringify(),
						success: function (data) {
							var citySelect = $("#citySelect");
							citySelect.empty();
							for (var i = 0; i < data.length; i++) {
								citySelect.append($('<option class="cityOPT">').text(data[i].cityName).val(data[i].cityId))
							}
						}

					})

				});

				$('#saveADD').off('click').on('click', function () {

					var photoInput = $("#addPhoto")[0]
					var photoFileName = photoInput.files.length > 0 ? photoInput.files[0].name : null;
					var sendingData = {
						"UserName": $("#addName").val(),
						"UserSurname": $("#addSurname").val(),
						"UserStatusId": $("#statSelect").val(),
						"UserPhone": $("#addPhone").val(),
						"UserEmail": $("#addEmail").val(),
						"UserPassword": $("#addPassword").val(),
						"UserCountryId": $("#countrySelect").val(),
						"UserCityId": $("#citySelect").val(),
						"UserProfilePhotoUrl": photoFileName
					}

					$.ajax({
						url: 'https://localhost:7090/api/admin/addUser',
						type: 'POST',
						contentType: 'application/json',
						data: JSON.stringify(sendingData),
						success: function (x) {
							$("#addModal").modal('hide');
							alert("User was added")
						},
						error: function () {
							console.log("User was not added")
						}
					})

				})

				$(document).ready(function () {
					$(".fa-trash-alt").each(function () {
						$(this).on('click', function () {

							$("#alertModal").modal('show');
							var row = $(this).closest('tr');
							var id = row.find('td:eq(1)').text();
							console.log(id);
							// Önceki olay kaydırıcısını kaldır
							$("#delete").off('click').on('click', function () {
								$.ajax({
									url: 'https://localhost:7090/api/admin/deleteUser/' + id,
									type: 'DELETE',
									contentType: 'application/json',
									data: JSON.stringify(),
									success: function () {
										console.log("user was deleted successfully")
									},
									error: function () {
										console.log("User was not deleted successfully")
									}
								})
							});
						});
					});
				});

			},
			error: function () {
				console.log("Error");
			}
		});
	});

	//Plant Type
	$("#planttype_li").click(() => {
		$.ajax({
			url: 'https://localhost:7090/api/admin/getPlantType',
			type: 'GET',
			contentType: 'application/json',
			data: JSON.stringify(),
			success: function (x) {
				$('#content').html("");
				$('#content').css('display', 'flex')

				var table_plantType = $('<table>').addClass('table table-bordered tableMeasure');
				var thead = $('<thead>');
				var tr = $('<tr>');
				var btnAddPlantType = $('<button class="btn mb-5" type="button" style="background-color:#4eac6d;color:white" data-bs-toggle="modal" data-bs-target="#addModalPlantType" id="addButtonPlantType" >Add</button>');
				tr.append('<th>' + 'Sıra' + '</th>');
				Object.keys(x[0]).forEach(function (key) {
					tr.append('<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>');
				})

				tr.append('<th>Edit</th>');
				tr.append('<th>Delete</th>');

				thead.append(tr);
				table_plantType.append(thead);

				var tbody = $('<tbody>');
				$('tbody').empty();
				$.each(x, function (index, item) {
					var tr = $('<tr>');
					tr.append('<td>' + (index + 1) + '</td>');
					tr.append('<td style="display: none;">' + item.id + '</td>');
					Object.keys(item).forEach(function (key) {
						if (key !== "id") {
							tr.append('<td>' + item[key] + '</td>');
						}
					});

					tr.append('<td><i class="fas editIcon fa-edit edit-icon-plantType" data-bs-toggle="modal" data-bs-target="#updateModalPlantType"></i></td>');
					tr.append('<td><i class="fas fa-trash-alt delete-icon-in-Plant-Type"></i></td>');

					tbody.append(tr);
					table_plantType.append(tbody);
				});
				$('#content').append(btnAddPlantType);
				$("#content").append(table_plantType)

				table_plantType.find('thead th:contains("Id")').hide();

				var modalUpdatePlantType = $('<div class="modal fade" id="updateModalPlantType" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label for="exampleInputEmail1">Name</label>\
								  <input  class="form-control" id="PlantTypeName" aria-describedby="emailHelp">\
								  <small id="emailHelp" class="form-text text-muted"></small>\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">Price</label>\
								  <input  class="form-control" id="PlantTypePrice">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">NameEng</label>\
								  <input  class="form-control" id="PlantTypeNameEng">\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="savePlantTypeUPD" class="btn" style="background-color:#4eac6d;color:white">Save changes</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var modalAddPlantType = $('<div class="modal fade" id="addModalPlantType" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label for="exampleInputEmail1">Name</label>\
								  <input  class="form-control" id="addPlantTypeName" aria-describedby="emailHelp">\
								  <small id="emailHelp" class="form-text text-muted"></small>\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">Price</label>\
								  <input  class="form-control" id="addPlantTypePrice">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">NameEng</label>\
								  <input  class="form-control" id="addPlantTypeNameEng">\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="addPlantTypeBTN" class="btn" style="background-color:#4eac6d;color:white">Add</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var alertModalPlantType = $('<div class="modal fade" id="deleteModalPlantType" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
					<div class="modal-dialog" role="document"> \
						<div class="modal-content"> \
							<div class="modal-header"> \
								<h1 class="modal-title fs-5">Modal title</h1> \
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
							</div> \
							<div class="modal-body"> \
							<form>\
							<p>Are you sure want to delete this plant type?</p>\
						  </form>\
							</div> \
							<div class="modal-footer"> \
								<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
								<button type="button" id="deletePlantType" class="btn" style="background-color:#4eac6d;color:white">Delete</button> \
							</div> \
						</div> \
					</div> \
				</div>')


				$('body').append(modalUpdatePlantType);
				$('body').append(modalAddPlantType);
				$('body').append(alertModalPlantType);

				// Modalı aç
				$('#updateModalPlantType').modal('hide');
				$('#addModalPlantType').modal('hide');
				$('deleteModalPlantType').modal('hide');


				$(document).ready(function () {

					$('#content').on('click', '.edit-icon-plantType', function () {
						var row = $(this).closest('tr');
						var plantTypeName = row.find('td:eq(2)').text();
						var plantPrice = row.find('td:eq(3)').text();
						var plantTypeNameEng = row.find('td:eq(4)').text();

						// Alınan verileri modal içindeki input alanlarına yerleştir
						$('#PlantTypeName').val(plantTypeName);
						$('#PlantTypePrice').val(plantPrice);
						$('#PlantTypeNameEng').val(plantTypeNameEng);


						$('#updateModalPlantType').modal('show');
						var id = row.find('td:eq(1)').text();
						console.log(id);



						$('#savePlantTypeUPD').off('click').on('click', function () {
							console.log(id);
							let info = {
								"PlantTypeName": $('#PlantTypeName').val(),
								"PlantPrice": $('#PlantTypePrice').val(),
								"PlantTypeNameEng": $('#PlantTypeNameEng').val(),
							};
							$.ajax({
								url: 'https://localhost:7090/api/admin/updatePlantType/' + id,
								type: 'PUT',
								contentType: 'application/json',
								data: JSON.stringify(info),
								success: function (x) {
									alert("Updated");
								},
								error: function () {
									alert("Error updating");
								}
							});
						});

					});

					$('#addButtonPlantType').on('click', function () {
						$('#addModalPlantType').modal('show')

						$('#addPlantTypeBTN').off('click').on('click', function () {
							let sendingData = {
								"PlantTypeName": $('#addPlantTypeName').val(),
								"PlantPrice": $('#addPlantTypePrice').val(),
								"PlantTypeNameEng": $('#addPlantTypeNameEng').val()
							}
							$.ajax({
								url: 'https://localhost:7090/api/admin/addPlantType',
								type: 'POST',
								contentType: 'application/json',
								data: JSON.stringify(sendingData),
								succes: function (x) {
									alert("Plant Type was successfully added")
								},
								error: function () {
									alert("Error")
								}
							})
						})
					})

					$(document).ready(function () {
						$(".fa-trash-alt").each(function () {
							$(this).on('click', function () {
								$("#deleteModalPlantType").modal('show');

								var row = $(this).closest('tr');
								var id = row.find('td:eq(1)').text();
								console.log(id);
								// Önceki olay kaydırıcısını kaldır
								$("#deletePlantType").off('click').on('click', function () {
									$.ajax({
										url: 'https://localhost:7090/api/admin/deletePlantType/' + id,
										type: 'DELETE',
										contentType: 'application/json',
										data: JSON.stringify(),
										success: function () {
											alert("Plant Type deleted successfully. Please refresh the page")
										},
										error: function () {
											alert("User was not deleted successfully")
										}
									})
								});
							});
						});
					});
				});
			},
			error: function () {
				console.log("Error")
			}
		})
	})


	//Plant 
	$('#plant_li').click(() => {
		$.ajax({
			url: 'https://localhost:7090/api/admin/getPlant',
			type: 'GET',
			contentType: 'application/json',
			dataType: JSON.stringify(),
			success: function (x) {

				$('#content').html("");
				$('#content').css('display', 'flex')

				var table_plant = $('<table>').addClass('table table-bordered tableMeasure');
				var thead = $('<thead>');
				var tr = $('<tr>');
				var btnAddPlant = $('<button class="btn mb-5" type="button" style="background-color:#4eac6d !important; color:white" data-bs-toggle="modal" data-bs-target="#addModalPlant" id="addButtonPlant">Add</button>');
				tr.append('<th>' + 'Sıra' + '</th>');
				Object.keys(x[0]).forEach(function (key) {
					tr.append('<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>');
				})

				tr.append('<th>Edit</th>');
				tr.append('<th>Delete</th>');

				thead.append(tr);
				table_plant.append(thead);

				var tbody = $('<tbody>');
				$('tbody').empty();
				$.each(x, function (index, item) {
					var tr = $('<tr>');
					tr.append('<td>' + (index + 1) + '</td>')
					tr.append('<td style="display: none;">' + item.id + '</td>');
					Object.keys(item).forEach(function (key) {
						if (key !== "id") {
							tr.append('<td>' + item[key] + '</td>');
						}
					});

					tr.append('<td><i class="fas editIcon fa-edit edit-icon-plant"></i></td>');
					tr.append('<td><i class="fas fa-trash-alt delete-icon-in-Plant"></i></td>');

					tbody.append(tr);
					table_plant.append(tbody);
				});
				$('#content').append(btnAddPlant);
				$("#content").append(table_plant)

				table_plant.find('thead th:contains("Id")').hide();

				var modalUpdatePlant = $('<div class="modal fade" id="updateModalPlant" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label>Name</label>\
								  <input  class="form-control" id="PlantName" aria-describedby="emailHelp">\
								  <small id="emailHelp" class="form-text text-muted"></small>\
								</div>\
								<div class="form-group">\
								  <label>NameEng</label>\
								  <input  class="form-control" id="PlantNameEng">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">PlantType</label>\
								  <select id="PlantTypeEditSelect" name="PlantPlantTypeId" style="display:block">\
								  </select>\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="savePlantUPD" class="btn" style="background-color:#4eac6d;color:white">Save changes</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var modalAddPlant = $('<div class="modal fade" id="addModalPlant" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label">Name</label>\
								  <input  class="form-control" id="addPlantName">\
								</div>\
								<div class="form-group">\
								  <label >NameEng</label>\
								  <input class="form-control" id="addPlantNameEng">\
								</div>\
								<div class="form-group">\
								  <label for="exampleInputPassword1">PlantType</label>\
								  <select id="plantPlantTypeSelect" name="PlantPlantTypeId" style="display:block"></select>\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="addPlantBTN" class="btn" style="background-color:#4eac6d;color:white">Add</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var alertModalPlant = $('<div class="modal fade" id="deleteModalPlant" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
					<div class="modal-dialog" role="document"> \
						<div class="modal-content"> \
							<div class="modal-header"> \
								<h1 class="modal-title fs-5">Modal title</h1> \
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
							</div> \
							<div class="modal-body"> \
							<form>\
							<p>Are you sure want to delete this plant type?</p>\
						  </form>\
							</div> \
							<div class="modal-footer"> \
								<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
								<button type="button" id="deletePlant" class="btn" style="background-color:#4eac6d;color:white">Delete</button> \
							</div> \
						</div> \
					</div> \
				</div>')

				$('body').append(modalUpdatePlant);
				$('body').append(alertModalPlant);
				$('body').append(modalAddPlant);
				$('#updateModalPlant').modal('hide');
				$('#deleteModalPlant').modal('hide');
				$('#addModalPlant').modal('hide');

				$(document).ready(function () {

					$('#content').off('click').on('click', '.edit-icon-plant', function () {
						var row = $(this).closest('tr');
						var plantName = row.find('td:eq(2)').text();
						var plantNameEng = row.find('td:eq(3)').text();
						var plantTypeId = row.find('td:eq(4)').text(); // PlantType ID değeri olduğunu varsayalım

						// Alınan verileri modal içindeki input alanlarına yerleştir
						$('#PlantName').val(plantName);
						$('#PlantNameEng').val(plantNameEng);

						// Select elementini seçilen değerle doldur
						$('#PlantTypeEditSelect').empty(); // Select içeriğini temizle
						$.ajax({
							type: 'GET',
							url: 'https://localhost:7090/api/admin/getPlantType',
							contentType: 'application/json',
							data: JSON.stringify(),
							success: function (data) {
								var select = $('#PlantTypeEditSelect');
								for (var i = 0; i < data.length; i++) {
									select.append($('<option>', {
										value: data[i].id,
										text: data[i].name,
										selected: data[i].name === plantTypeId
									}));
								}
							},
							error: function () {
								console.log("Error")
							}
						});

						$('#updateModalPlant').modal('show');
						var id = row.find('td:eq(1)').text();
						console.log(id);

						$('#savePlantUPD').off('click').on('click', function () {

							let info = {
								"PlantName": $('#PlantName').val(),
								"PlantNameEng": $('#PlantNameEng').val(),
								"PlantPlantTypeId": $('#PlantTypeEditSelect').val(),
							};
							$.ajax({
								url: 'https://localhost:7090/api/admin/updatePlant/' + id,
								type: 'PUT',
								contentType: 'application/json',
								data: JSON.stringify(info),
								success: function (x) {
									alert("Updated");
								},
								error: function () {
									alert("Error updating");
								}
							});
						});
					});
					$(document).ready(function () {
						$(".fa-trash-alt").each(function () {
							$(this).off('click').on('click', function () {
								$("#deleteModalPlant").modal('show');
								var row = $(this).closest('tr');
								var id = row.find('td:eq(1)').text();
								console.log(id);
								// Önceki olay kaydırıcısını kaldır
								$("#deletePlant").off('click').on('click', function () {
									$.ajax({
										url: 'https://localhost:7090/api/admin/deletePlant/' + id,
										type: 'DELETE',
										contentType: 'application/json',
										data: JSON.stringify(),
										success: function () {
											alert("Plant Type deleted successfully. Please refresh the page")
										},
										error: function () {
											alert("User was not deleted successfully")
										}
									})
								});
							});
						});
					});
					$(document).ready(function () {
						$('#addButtonPlant').off('click').click(() => {
							$.ajax({
								type: 'GET',
								url: 'https://localhost:7090/api/admin/getPlantType',
								contentType: 'application/json',
								data: JSON.stringify(),
								success: function (data) {
									console.log(data)
									var select = $('#plantPlantTypeSelect')
									select.empty();
									for (var i = 0; i < data.length; i++) {
										select.append($('<option class="countryOPT">').text(data[i].name).val(data[i].id))
									}
								},
								error: function () {
									console.log("Error")
								}
							})
							$("#addPlantBTN").off('click').click(() => {
								let plantInfo = {
									"PlantName": $('#addPlantName').val(),
									"PlantNameEng": $('#addPlantNameEng').val(),
									"PlantPlantTypeId": $('#plantPlantTypeSelect').val()
								}
								$.ajax({
									type: 'POST',
									url: 'https://localhost:7090/api/admin/addPlant',
									contentType: 'application/json',
									data: JSON.stringify(plantInfo),
									success: function (data) {
										alert("Plant added successfully");
									},
									error: function () {
										alert("Error adding")
									}
								})
							})
						})
					})
				})

			},


			error: function () {
				console.log("Error")
			}
		})
	})

	$("#operator_plant_li").click(() => {
		$.ajax({
			url: 'https://localhost:7090/api/admin/getOP',
			type: 'GET',
			contentType: 'application/json',
			dataType: JSON.stringify(),
			success: function (x) {

				$('#content').html("");
				$('#content').css('display', 'flex')

				var table_Operator_plant = $('<table>').addClass('table table-bordered tableMeasure');
				var thead = $('<thead>');
				var tr = $('<tr>');
				var btnAddOperatorPlant = $('<button class="btn mb-5" type="button" style="background-color:#4eac6d; padding:15px;border-radius:5px;border:none;color:white" data-bs-toggle="modal" data-bs-target="#addModalOperatorPlant" id="addButtonOperatorPlant">Add</button>');
				tr.append('<th>' + 'Sıra' + '</th>');
				Object.keys(x[0]).forEach(function (key) {
					tr.append('<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>');
				})

				tr.append('<th>Edit</th>');
				tr.append('<th>Delete</th>');

				thead.append(tr);
				table_Operator_plant.append(thead);

				var tbody = $('<tbody>');
				$('tbody').empty();
				$.each(x, function (index, item) {
					var tr = $('<tr>');
					tr.append('<td>' + (index + 1) + '</td>');
					tr.append('<td style="display: none;">' + item.opId + '</td>');
					Object.keys(item).forEach(function (key) {
						if (key !== "opId") {
							tr.append('<td>' + item[key] + '</td>');
						}
					});

					tr.append('<td><i class="fas editIcon fa-edit edit-icon-plant"></i></td>');
					tr.append('<td><i class="fas fa-trash-alt delete-icon-in-Plant"></i></td>');

					tbody.append(tr);
					table_Operator_plant.append(tbody);
				});
				$('#content').append(btnAddOperatorPlant);
				$("#content").append(table_Operator_plant)

				table_Operator_plant.find('thead th:contains("OpId")').hide();

				var modalUpdateOperatorPlant = $('<div class="modal fade" id="updateModalOperatorPlant" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label>UserName</label>\
								  <select id="OperatorPlantUserEditSelect" name="OP_OperatorId" style="display:block">\
								  </select>\
								</div>\
								<div class="form-group">\
								  <label>PlantName</label>\
								  <select id="OperatorPlantPlantEditSelect" name="OP_PlantId" style="display:block">\
								  </select>\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="savePlantUPD" class="btn" style="background-color:#4eac6d;color:white">Save changes</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var modalAddOperatorPlant = $('<div class="modal fade" id="addModalOperatorPlant" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
                        <div class="modal-dialog" role="document"> \
                            <div class="modal-content"> \
                                <div class="modal-header"> \
                                    <h1 class="modal-title fs-5">Modal title</h1> \
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
                                </div> \
                                <div class="modal-body"> \
								<form>\
								<div class="form-group">\
								  <label">UserName</label>\
								  <select id="OperatorPlantUserAddSelect" name="OP_OperatorId" style="display:block">\
								  </select>\
								</div>\
								<div class="form-group">\
								  <label >PlantName</label>\
								  <select id="OperatorPlantPlantAddSelect" name="OP_PlantId" style="display:block">\
								  </select>\
								</div>\
							  </form>\
                                </div> \
                                <div class="modal-footer"> \
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
                                    <button type="button" id="addOperatorPlantBTN" class="btn" style="background-color:#4eac6d;color:white">Add</button> \
                                </div> \
                            </div> \
                        </div> \
                    </div>');

				var alertModalOperatorPlant = $('<div class="modal fade" id="deleteModalOperatorPlant" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> \
					<div class="modal-dialog" role="document"> \
						<div class="modal-content"> \
							<div class="modal-header"> \
								<h1 class="modal-title fs-5">Modal title</h1> \
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> \
							</div> \
							<div class="modal-body"> \
							<form>\
							<p>Are you sure want to delete this plant type?</p>\
						  </form>\
							</div> \
							<div class="modal-footer"> \
								<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> \
								<button type="button" id="deleteOperatorPlant" class="btn" style="background-color:#4eac6d;color:white">Delete</button> \
							</div> \
						</div> \
					</div> \
				</div>')

				$('body').append(modalUpdateOperatorPlant);
				$('body').append(alertModalOperatorPlant);
				$('body').append(modalAddOperatorPlant);
				$('#updateModalOperatorPlant').modal('hide');
				$('#deleteModalOperatorPlant').modal('hide');
				$('#addModalOperatorPlant').modal('hide');

				$(document).ready(function () {

					$('#content').off('click').on('click', '.edit-icon-plant', function () {
						var row = $(this).closest('tr');
						// var plantName = row.find('td:eq(2)').text();
						// var plantNameEng = row.find('td:eq(3)').text();
						// var plantTypeId = row.find('td:eq(4)').text(); // PlantType ID değeri olduğunu varsayalım

						// // Alınan verileri modal içindeki input alanlarına yerleştir
						//  $('#PlantName').val(plantName);
						// $('#PlantNameEng').val(plantNameEng);

						// Select elementini seçilen değerle doldur
						$('#OperatorPlantUserEditSelect').empty(); // Select içeriğini temizle
						$.ajax({
							type: 'GET',
							url: 'https://localhost:7090/api/admin/getOperators',
							contentType: 'application/json',
							data: JSON.stringify(),
							success: function (data) {
								var select = $('#OperatorPlantUserEditSelect');
								for (var i = 0; i < data.length; i++) {
									select.append($('<option>', {
										value: data[i].userId,
										text: data[i].userName + " " + data[i].userSurname,
									}));
								}
							},
							error: function () {
								console.log("Error")
							}
						});

						$('#OperatorPlantPlantEditSelect').empty(); // Select içeriğini temizle
						$.ajax({
							type: 'GET',
							url: 'https://localhost:7090/api/admin/getPlant',
							contentType: 'application/json',
							data: JSON.stringify(),
							success: function (data) {
								console.log(data)
								var select = $('#OperatorPlantPlantEditSelect')
								select.empty();
								for (var i = 0; i < data.length; i++) {
									select.append($('<option class="operatorPlantOption">').text(data[i].name).val(data[i].id))
								}
							},
							error: function () {
								console.log("Error")
							}
						})


						$('#updateModalOperatorPlant').modal('show');
						var id = row.find('td:eq(1)').text();
						console.log(id);

						$('#savePlantUPD').off('click').on('click', function () {

							let info = {
								"OpOperatorId": $('#OperatorPlantUserEditSelect').val(),
								"OpPlantId": $('#OperatorPlantPlantEditSelect').val(),
							};
							$.ajax({
								url: 'https://localhost:7090/api/admin/updateOP/' + id,
								type: 'PUT',
								contentType: 'application/json',
								data: JSON.stringify(info),
								success: function (x) {
									alert("Updated");
								},
								error: function () {
									alert("Error updating");
								}
							});
						});
					});
					$(document).ready(function () {
						$(".fa-trash-alt").each(function () {
							$(this).off('click').on('click', function () {
								$("#deleteModalOperatorPlant").modal('show');
								var row = $(this).closest('tr');
								var id = row.find('td:eq(1)').text();
								console.log(id);
								// Önceki olay kaydırıcısını kaldır
								$("#deleteOperatorPlant").off('click').on('click', function () {
									$.ajax({
										url: 'https://localhost:7090/api/admin/deleteOP/' + id,
										type: 'DELETE',
										contentType: 'application/json',
										data: JSON.stringify(),
										success: function () {
											alert("Plant Type deleted successfully. Please refresh the page")
										},
										error: function () {
											alert("User was not deleted successfully")
										}
									})
								});
							});
						});
					});
					$(document).ready(function () {
						$('#addButtonOperatorPlant').off('click').click(() => {
							$('#OperatorPlantUserAddSelect').empty();
							$.ajax({
								type: 'GET',
								url: 'https://localhost:7090/api/admin/getOperators',
								contentType: 'application/json',
								data: JSON.stringify(),
								success: function (data) {
									console.log(data)
									var select = $('#OperatorPlantUserAddSelect')
									select.empty();
									for (var i = 0; i < data.length; i++) {
										select.append($('<option class="operatorPlantOption">').text(data[i].userName + " " + data[i].userSurname).val(data[i].userId))
									}
								},
								error: function () {
									console.log("Error")
								}
							})

							$('#OperatorPlantPlantAddSelect').empty();
							$.ajax({
								type: 'GET',
								url: 'https://localhost:7090/api/admin/getPlant',
								contentType: 'application/json',
								data: JSON.stringify(),
								success: function (data) {
									console.log(data)
									var select = $('#OperatorPlantPlantAddSelect')
									select.empty();
									for (var i = 0; i < data.length; i++) {
										select.append($('<option class="operatorPlantOption">').text(data[i].name).val(data[i].id))
									}
								},
								error: function () {
									console.log("Error")
								}
							})
							$("#addOperatorPlantBTN").off('click').click(() => {
								let OperatorPlantInfo = {
									"OpOperatorId": $('#OperatorPlantUserAddSelect').val(),
									"OpPlantId": $('#OperatorPlantPlantAddSelect').val(),
								}
								$.ajax({
									type: 'POST',
									url: 'https://localhost:7090/api/admin/addOP',
									contentType: 'application/json',
									data: JSON.stringify(OperatorPlantInfo),
									success: function (data) {
										alert("Plant added successfully");
									},
									error: function () {
										alert("Error adding")
									}
								})
							})
						})
					})
				})

			},


			error: function () {
				console.log("Error")
			}
		})
	})

	$('#rating_li').click(() => {
		$.ajax({
			url: 'https://localhost:7090/api/admin/getRating',
			type: 'GET',
			contentType: 'application/json',
			dataType: JSON.stringify(),
			success: function (data) {
				$('#content').html("");
				$('#content').css('display', 'flex')

				var table_Rating = $('<table>').addClass('table table-bordered tableMeasure');
				var thead = $('<thead>');
				var tr = $('<tr>');
				tr.append('<th>' + 'Sıra' + '</th>');
				Object.keys(data[0]).forEach(function (key) {
					tr.append('<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>');
				})


				thead.append(tr);
				table_Rating.append(thead);

				var tbody = $('<tbody>');
				$('tbody').empty();
				$.each(data, function (index, item) {
					var tr = $('<tr>');
					tr.append('<td>' + (index + 1) + '</td>');
					tr.append('<td style="display: none;">' + item.ratingId + '</td>');
					tr.append('<td style="display: none;">' + item.ratingAppealId + '</td>');
					Object.keys(item).forEach(function (key) {
						console.log(key);
						if (key !== "ratingId" && key !== "ratingAppealId") {
							tr.append('<td>' + item[key] + '</td>');
						}
					});


					tbody.append(tr);
					table_Rating.append(tbody);
				});
				$("#content").append(table_Rating);

				table_Rating.find('thead th:contains("RatingId")').hide();
				table_Rating.find('thead th:contains("RatingAppealId")').hide();
			},
			error: function (data) {
				console.log("Error");
			}
		})
	})

	$("#appeal_li").click(() => {
		$.ajax({
			url: 'https://localhost:7090/api/admin/getAppeal',
			type: 'GET',
			contentType: 'application/json',
			dataType: JSON.stringify(),
			success: function (data) {
				$('#content').html("");
				$('#content').css('display', 'flex')

				var table_Appeal = $('<table>').addClass('table table-bordered tableMeasure');
				var thead = $('<thead>');
				var tr = $('<tr>');
				tr.append('<th>' + 'Sıra' + '</th>');
				Object.keys(data[0]).forEach(function (key) {
					tr.append('<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>');
				})

				thead.append(tr);
				table_Appeal.append(thead);

				var tbody = $('<tbody>');
				$('tbody').empty();
				$.each(data, function (index, item) {
					var tr = $('<tr>');
					tr.append('<td>' + (index + 1) + '</td>');
					tr.append('<td style="display: none;">' + item.appealId + '</td>');
					tr.append('<td style="display: none;">' + item.paidOrUnpaid12 + '</td>');
					tr.append('<td style="display: none;">' + item.endOrNotEnd + '</td>');
					tr.append('<td style="display: none;">' + item.appealPlant + '</td>');
					tr.append('<td style="display: none;">' + item.appealPlantTypeId + '</td>');
					Object.keys(item).forEach(function (key) {
						console.log(key);
						if (key !== "appealId" && key !== "paidOrUnpaid12" && key !== "endOrNotEnd" && key !== "appealPlant" && key !== "appealPlantTypeId") {
							tr.append('<td>' + item[key] + '</td>');
						}
					});


					tbody.append(tr);
					table_Appeal.append(tbody);
				});
				$("#content").append(table_Appeal);

				table_Appeal.find('thead th:contains("AppealId")').hide();
				table_Appeal.find('thead th:contains("PaidOrUnpaid12")').hide();
				table_Appeal.find('thead th:contains("EndOrNotEnd")').hide();
				table_Appeal.find('thead th:contains("AppealPlant")').hide();
				table_Appeal.find('thead th:contains("AppealPlantId")').show();
				table_Appeal.find('thead th:contains("AppealPlantName")').show();
			},
			error: function () {
				console.log("Error");
			}
		})
	})

	$('.logout_li').click(() => {
		alert();
		localStorage.removeItem('UserId');
		localStorage.removeItem('UserName');
		localStorage.removeItem('UserProfilePhotoUrl');
		localStorage.removeItem('UserSurname');
		localStorage.removeItem('UserEmail');
		localStorage.removeItem('UserCountry');
		localStorage.removeItem('UserCity');

		window.location.href = '/PlantOrgLogin.html'
	})

})


