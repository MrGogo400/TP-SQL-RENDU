const name = "hugo-marques"
const promo = "B2B"

const q1 = `
SELECT * FROM Track 
WHERE Milliseconds < (
 SELECT Milliseconds 
 FROM Track 
 WHERE TrackId = 3457 ) 
`

const q2 = `
SELECT * FROM Track 
WHERE MediaTypeId = (
 SELECT MediaTypeId 
 FROM Track 
 WHERE Name = 'Rehab')
 `

const q3 = `
SELECT p.PlaylistId, p.Name, COUNT(p.PlaylistId) AS "Nombres de chansons", SUM(t.Milliseconds) AS "Durée totale", AVG(t.Milliseconds) AS "Durée moyenne"
  FROM Playlist p
  JOIN PlaylistTrack pt
  ON p.PlaylistId = pt.PlaylistId
  JOIN Track t
  ON pt.TrackId = t.TrackId
  GROUP BY p.PlaylistId, p.Name;
`
const q4 = `
SELECT p.PlaylistId, p.Name, COUNT(p.PlaylistId) AS "Nombres de chansons", SUM(t.Milliseconds) AS "Durée totale", AVG(t.Milliseconds) AS "Durée moyenne"
  FROM Playlist p
  JOIN PlaylistTrack pt
  ON p.PlaylistId = pt.PlaylistId
  JOIN Track t
  ON pt.TrackId = t.TrackId
  GROUP BY p.PlaylistId, p.Name
  HAVING SUM(t.Milliseconds) > AVG(t.Milliseconds)
  ;
`
const q5 = `
SELECT p.PlaylistId, p.Name, COUNT(p.PlaylistId) AS "Nbrs de chansons"
FROM Playlist p
JOIN PlaylistTrack pt
ON p.PlaylistId = pt.PlaylistId
JOIN Track t
ON pt.TrackId = t.TrackId
GROUP BY p.PlaylistId, p.Name
HAVING COUNT(p.PlaylistId) = (
    SELECT COUNT(p.PlaylistId)
    FROM Playlist p
    JOIN PlaylistTrack pt
    ON p.PlaylistId = pt.PlaylistId
    WHERE p.PlaylistId= 1
    GROUP BY p.PlaylistId, p.Name
)
OR COUNT(p.PlaylistId) = (
    SELECT COUNT(p.PlaylistId)
    FROM Playlist p
    JOIN PlaylistTrack pt
    ON p.PlaylistId = pt.PlaylistId
    WHERE p.PlaylistId= 13
    GROUP BY p.PlaylistId, p.Name
);
`
const q6 = `
SELECT c.CustomerId, i.Total, c.Country, i.InvoiceId
FROM Customer c
JOIN Invoice i
ON c.CustomerId = i.CustomerId
WHERE i.Total > (
    SELECT MIN(i.Total)
    FROM Customer c
    JOIN Invoice i
    ON c.CustomerId = i.CustomerId
    WHERE c.Country = 'France'
)
AND c.Country NOT LIKE 'France'
ORDER BY c.Country;
`
const q7 = `
SELECT BillingCountry, MIN(Total) AS MINIMUM, MAX(Total)  AS MAXIMUM, (SUM(Total)/COUNT(Total)) AS 'Total de commande moyen', COUNT(InvoiceId) AS 'Nombre de commandes', (count(Total) * 100.0 /  (select count(*) from Invoice)) AS 'Pourcentage'
FROM Invoice
GROUP BY BillingCountry
`
const q8 = `
SELECT *, (select sum(UnitPrice) from Track) / (select count(*) from Track) as "Prix Moyen", med.Name as "Media name", (select sum(UnitPrice) from Track join MediaType on MediaType.MediaTypeId = Track.MediaTypeId where MediaType.Name = med.Name) / (select count(*) from Track join MediaType on MediaType.MediaTypeId = Track.MediaTypeId where MediaType.Name = med.Name) 
From Track
join MediaType med on med.MediaTypeId = Track.MediaTypeId
where UnitPrice > ((select sum(UnitPrice) from Track) / (select count(*) from Track));
`
const q9 = ``
const q10 = `
SELECT ar.Name AS "Artiste",
  COUNT(ar.Name) AS "Nombre de chansons par Artiste",
  AVG(t.UnitPrice) AS "Prix moyen des chansons",
  MAX(ar.ArtistId) AS "Nombre maximum d'artistes"
  FROM Playlist p
  JOIN PlaylistTrack pt
  ON p.PlaylistId = pt.PlaylistId
  JOIN Track t
  ON pt.TrackId = t.TrackId
  JOIN Album al
  ON t.AlbumId = al.AlbumId
  JOIN Artist ar
  ON al.ArtistId = ar.ArtistId
  GROUP BY p.Name, ar.Name
  ORDER BY p.Name
`
const q11 = `
SELECT Pays, COUNT(*)
  FROM
  (SELECT BillingCountry as Pays
  FROM Invoice
  UNION ALL
  SELECT Country as Pays
  FROM Customer
  UNION ALL
  SELECT Country as Pays
  FROM Employee) as result
  GROUP BY Pays
  ORDER BY Pays
`
const q12 = ``
const q13 = `
SELECT inv.InvoiceId, track.Milliseconds
  FROM Invoice as inv
  JOIN InvoiceLine as invl
  ON inv.InvoiceId = invl.InvoiceId
  JOIN Track as track
  ON invl.TrackId = track.TrackId
  WHERE track.Milliseconds IN
  (SELECT MAX(track.Milliseconds)
  FROM Track as track
  JOIN Genre as genre
  ON track.GenreId = genre.GenreId
  GROUP BY genre.Name)
  ORDER BY inv.InvoiceId
`
const q14 = `
SELECT i.InvoiceId, ROUND(CAST(AVG(il.UnitPrice) AS float), 2) "prix moyen/track", SUM(t.Milliseconds) 'durée total track', SUM(i.Total) / SUM(t.Milliseconds) 'prix par sec'
    FROM Invoice i
    JOIN InvoiceLine il
    ON i.InvoiceId = il.InvoiceId
    JOIN Track t
    ON t.TrackId = il.TrackId
    GROUP BY i.InvoiceId
`
const q15 = `
  SELECT e.LastName, e.FirstName, SUM(i.InvoiceId) AS "Ventes", e.EmployeeId
  FROM Employee e
  JOIN Customer c
  ON e.EmployeeId = c.SupportRepId
  JOIN Invoice i
  ON c.CustomerId = i.CustomerId
  WHERE e.EmployeeId = 5
  GROUP BY e.LastName, e.FirstName, e.EmployeeId
`
const q16 = ``
const q17 = ``
const q18 = `
CREATE TABLE "User" (
  id INT NOT NULL IDENTITY PRIMARY KEY,
  username varchar(255),
  email varchar(255),
  superuser bit DEFAULT 0
);

CREATE TABLE "Group" (
  id INT NOT NULL IDENTITY PRIMARY KEY,
  nam varchar(255),
  display_name varchar(255),
  description text
);

CREATE TABLE "Role" (
  id INT NOT NULL IDENTITY PRIMARY KEY,
  name varchar(255),
  display_name varchar(255),
  description text
);

CREATE TABLE "Permission" (
  id INT NOT NULL IDENTITY PRIMARY KEY,
  name varchar(255),
  display_name varchar(255),
  description text
);

CREATE TABLE User_Role (
  user_id INT FOREIGN KEY REFERENCES "User"(id),
  role_id INT  FOREIGN KEY REFERENCES "Role"(id)
);

CREATE TABLE User_Group (
  user_id INT FOREIGN KEY REFERENCES "User"(id),
  group_id INT FOREIGN KEY REFERENCES "Group"(id),
);

CREATE TABLE Group_Role (
  group_id INT FOREIGN KEY REFERENCES "Group"(id),
  role_id INT FOREIGN KEY REFERENCES "Role"(id)
);

CREATE TABLE Role_Permission (
  role_id INT FOREIGN KEY REFERENCES "Role"(id),
  permission_id INT FOREIGN KEY REFERENCES "Permission"(id)
);
`
const q19 = `
INSERT INTO Track(Name,MediaTypeId,GenreId,Composer,Milliseconds,Bytes,UnitPrice)
VALUES ('Halo',1,13,'Beyoncé',333333,1234567,'5');
INSERT INTO Track(Name,MediaTypeId,GenreId,Composer,Milliseconds,Bytes,UnitPrice)
VALUES ('Umbrella',1,3,'Rihanna',333333,4647654321,'2.99');
INSERT INTO Track(Name,MediaTypeId,GenreId,Composer,Milliseconds,Bytes,UnitPrice)
VALUES ('Crazy in love',1,5,'Beyoncé',976543,097654,'0.99');
`
const q20 = `
INSERT INTO Employee (LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email)
Values ('george ','lucas','monstre',2,'1970/09/12','2001/12/12','14 allée des violettes','paris','FR','France','33114','0767896565','0789865465','null@ynov.com')
INSERT INTO Employee (LastName, FirstName, Title, ReportsTo, BirthDate, HireDate, Address, City, State, Country, PostalCode, Phone, Fax, Email)
Values ('lui','moi','chomage',6,'1986/08/26','2001/12/05','14 allée des violettes odheg','Le barp','FR','France','33114','0780986767','5353646475','null2@ynov.com')
`
const q21 = `
DELETE FROM InvoiceLine
WHERE FORMAT(Invoice.InvoiceDate,'yyyy') LIKE '2010'
`
const q22 = `
UPDATE Invoice
SET BillingCountry = 'France'
WHERE CONVERT(INT, CONVERT(DATETIME, InvoiceDate)) > 40543
AND
BillingCountry = 'Germany'
`
const q23 = `
UPDATE Invoice
SET BillingCountry = c.Country
FROM Invoice inv
FULL JOIN Customer c
ON c.CustomerId = inv.CustomerId
WHERE inv.BillingCountry <> c.Country
`
const q24 = `
ALTER TABLE Employee
ADD Salary INT
`
const q25 = `
UPDATE Employee
SET Salary = RAND(CHECKSUM(NEWID()))*(100000-30000)+30000
`
const q26 = `
ALTER TABLE Invoice
DROP COLUMN BillingPostalCode
`











































// NE PAS TOUCHER CETTE SECTION
const tp = {name: name, promo: promo, queries: [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26]}
module.exports = tp
